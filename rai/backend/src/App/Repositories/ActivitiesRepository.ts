import { inject, injectable } from "inversify";
import { DbGateway } from "../Services/DbGateway";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { ActivitiesSchema } from "./DBSchemas/ActivitiesSchema";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "./Types/RepositoryTypes";

// Define schemas
const ActivityWithStatsSchema = z.object({
  category: z.string().nonempty({ message: "Category cannot be empty" }),
  activity_id: z.number().int().positive(),
  activity: z.string().nonempty({ message: "Activity cannot be empty" }),
  category_id: z.number().int().positive(),
  stat: z.string().nonempty({ message: "Stat cannot be empty" }),
  base_stat_value: z.number(),
});

type ActivityWithStats = z.infer<typeof ActivityWithStatsSchema>;

type GroupedActivities = {
  category: string;
  activities: {
    id: number;
    activity: string;
    category_id: number;
    stats: {
      stat: string;
      base_stat_value: number;
    }[];
  }[];
};

@injectable()
export class ActivitiesRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async listActivities(): Promise<RepositoryResult<GroupedActivities[]>> {
    const result = await this.dbGateway.query(
      `SELECT ActivityCategories.category, Activities.id AS activity_id, Activities.activity, Activities.category_id, Stats.stat, ActivityBaseStats.base_stat_value
      FROM Activities
      INNER JOIN ActivityCategories ON Activities.category_id = ActivityCategories.id
      INNER JOIN ActivityBaseStats ON Activities.id = ActivityBaseStats.activity_id
      INNER JOIN Stats ON ActivityBaseStats.stat_id = Stats.id`
    );

    if (!result.dbSuccess) {
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };
    }

    if (result.data.length === 0) {
      return {
        status: RepositoryResultStatus.failed,
        messages: ["No activities"],
      };
    }

    const validationResult = z.array(ActivityWithStatsSchema).safeParse(result.data);

    if (!validationResult.success) {
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };
    }

    const groupedActivities = validationResult.data.reduce((acc, current) => {
      const { category, activity_id, activity, category_id, stat, base_stat_value } = current;

      if (!acc[category]) {
        acc[category] = [];
      }

      let activityItem = acc[category].find(a => a.id === activity_id);

      if (!activityItem) {
        activityItem = { id: activity_id, activity, category_id, stats: [] };
        acc[category].push(activityItem);
      }

      activityItem.stats.push({ stat, base_stat_value });

      return acc;
    }, {} as { [key: string]: { id: number; activity: string; category_id: number; stats: { stat: string; base_stat_value: number }[] }[] });

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
