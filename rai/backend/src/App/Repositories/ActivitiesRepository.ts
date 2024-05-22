import { inject, injectable } from "inversify";
import { DbGateway } from "../Services/DbGateway";
import { UserAuthSchema } from "./DBSchemas/UserSchema";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "./Types/RepositoryTypes";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { ActivitiesSchema } from "./DBSchemas/ActivitiesSchema";

const ActivityWithCategorySchema = ActivitiesSchema.extend({
  category: z.string().nonempty({ message: "Category cannot be empty" }),
});

type Activity = z.infer<typeof ActivitiesSchema>;
type ActivityWithCategory = z.infer<typeof ActivityWithCategorySchema>;

type GroupedActivities = {
  category: string;
  activities: Omit<ActivityWithCategory, 'category'>[];
};

@injectable()
export class ActivitiesRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async listActivities(): Promise<RepositoryResult<GroupedActivities[]>> {
      const result = await this.dbGateway.query("SELECT ActivityCategories.category, Activities.id, Activities.activity, Activities.category_id FROM Activities INNER JOIN ActivityCategories on Activities.category_id = ActivityCategories.id");
      if (!result.dbSuccess)
        return {
          status: RepositoryResultStatus.dbError,
          errors: ["Database error!"],
        };
      if (result.data.length === 0)
        return {
          status: RepositoryResultStatus.failed,
          messages: ["No activities"],
        };

      const validationResult = z.array(ActivityWithCategorySchema).safeParse(result.data);

      if (!validationResult.success)
            return {
              status: RepositoryResultStatus.zodError,
              errors: [
                "Invalid data from database!",
                ...validationResult.error.errors.map((e) => e.message),
              ],
            };

      const groupedActivities = validationResult.data.reduce((acc, current) => {
            const { category, ...activityDetails } = current;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(activityDetails);
            return acc;
          }, {} as { [key: string]: Omit<ActivityWithCategory, 'category'>[] });

          // Map the object to an array format
          const activitiesUnderCategories: GroupedActivities[] = Object.keys(groupedActivities).map(category => ({
            category,
            activities: groupedActivities[category]
          }));

      return {
        status: RepositoryResultStatus.success,
        data: activitiesUnderCategories,
      };
    }
}
