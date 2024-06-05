import { inject, injectable } from "inversify";
import { DbGateway } from "../../../Services/DbGateway";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { ActivitiesSchema } from "./DBSchemas/ActivitiesSchema";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "../../../Types/RepositoryTypes";

// Define schemas
const ActivityWithStatsSchema = z.object({
  category: z.string().nonempty({ message: "Category cannot be empty" }),
  activity_id: z.number().int().positive(),
  activity: z.string().nonempty({ message: "Activity cannot be empty" }),
  category_id: z.number().int().positive(),
  stat: z.string().nonempty({ message: "Stat cannot be empty" }),
  base_stat_value: z.number(),
});
const ExecutedActivityStatsSchema = z.object({
  executed_activity_id: z.number().int().positive({ message: "Executed activity ID must be a positive integer" }),
  activity_id: z.number().int().positive({ message: "Activity ID must be a positive integer" }),
  user_id: z.number().int().positive({ message: "User ID must be a positive integer" }),
  start_time: z.union([z.string(), z.date()]).refine(value => !isNaN(Date.parse(value as string)), { message: "Invalid start time format" }),
  duration: z.number().int().positive({ message: "Duration must be a positive integer" }),
  is_active: z.boolean({ message: "Is active must be a boolean" }),
  stat_id: z.number().int().positive({ message: "Stat ID must be a positive integer" }),
  current_value: z.number().int().positive({ message: "Current value must be a positive integer" }),
  last_updated: z.union([z.string(), z.date()]).refine(value => !isNaN(Date.parse(value as string)), { message: "Invalid last updated format" }),
  stat: z.string().nonempty({ message: "Stat cannot be empty" }),
});

const AggregatedStatsSchema = z.object({
  stat_id: z.number().int().positive({ message: "Stat ID must be a positive integer" }),
  stat: z.string().nonempty({ message: "Stat cannot be empty" }),
  total_value: z.number().int().nonnegative({ message: "Total value must be a non-negative integer" }),
});


type AggregatedStats = z.infer<typeof AggregatedStatsSchema>;
type ActivityWithStats = z.infer<typeof ActivityWithStatsSchema>;
type ExecutedActivityStats = z.infer<typeof ExecutedActivityStatsSchema>;

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

  public async getExecutedActivityStats(userId: number, activityId: number): Promise<RepositoryResult<ExecutedActivityStats[]>> {
      const result = await this.dbGateway.query(
        `SELECT
            ea.id AS executed_activity_id,
            ea.activity_id,
            ea.user_id,
            ea.start_time,
            ea.duration,
            ea.is_active,
            rs.stat_id,
            rs.current_value,
            rs.last_updated,
            s.stat
         FROM
            ExecutedActivities ea
         INNER JOIN
            RealTimeStats rs ON ea.id = rs.executed_activity_id
         INNER JOIN
            Stats s ON rs.stat_id = s.id
         WHERE
            ea.user_id = $1 AND ea.activity_id = $2`,
        [userId, activityId]
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
          messages: ["No executed activities found"],
        };
      }

      const validationResult = z.array(ExecutedActivityStatsSchema).safeParse(result.data);

      if (!validationResult.success) {
        return {
          status: RepositoryResultStatus.zodError,
          errors: [
            "Invalid data from database!",
            ...validationResult.error.errors.map((e) => e.message),
          ],
        };
      }

      return {
        status: RepositoryResultStatus.success,
        data: validationResult.data,
      };
    }

    public async aggregateUserStats(userId: number): Promise<RepositoryResult<AggregatedStats[]>> {
        const result = await this.dbGateway.query(
          `SELECT
              s.id AS stat_id,
              s.stat,
              COALESCE(SUM(rs.current_value)::int, 0) AS total_value
           FROM
              ExecutedActivities ea
           INNER JOIN
              RealTimeStats rs ON ea.id = rs.executed_activity_id
           INNER JOIN
              Stats s ON rs.stat_id = s.id
           WHERE
              ea.user_id = $1
           GROUP BY
              s.id, s.stat`,
          [userId]
        );

        if (!result.dbSuccess) {
          return {
            status: RepositoryResultStatus.dbError,
            errors: ["Database error!"],
          };
        }

        const validationResult = z.array(AggregatedStatsSchema).safeParse(result.data);

        if (!validationResult.success) {
          return {
            status: RepositoryResultStatus.zodError,
            errors: [
              "Invalid data from database!",
              ...validationResult.error.errors.map((e) => e.message),
            ],
          };
        }

        return {
          status: RepositoryResultStatus.success,
          data: validationResult.data,
        };
      }

      public async listActivityStats(userId: number): Promise<RepositoryResult<ExecutedActivityStats[]>> {
        const result = await this.dbGateway.query(
          `SELECT
              ea.id AS executed_activity_id,
              ea.activity_id,
              ea.user_id,
              ea.start_time,
              ea.duration,
              ea.is_active,
              rs.stat_id,
              rs.current_value,
              rs.last_updated,
              s.stat
           FROM
              ExecutedActivities ea
           INNER JOIN
              RealTimeStats rs ON ea.id = rs.executed_activity_id
           INNER JOIN
              Stats s ON rs.stat_id = s.id
           WHERE
              ea.user_id = $1 and ea.is_active = false`,
          [userId]
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
            messages: ["No activity stats found"],
          };
        }
    
        const validationResult = z.array(ExecutedActivityStatsSchema).safeParse(result.data);
    
        if (!validationResult.success) {
          return {
            status: RepositoryResultStatus.zodError,
            errors: [
              "Invalid data from database!",
              ...validationResult.error.errors.map((e) => e.message),
            ],
          };
        }
    
        return {
          status: RepositoryResultStatus.success,
          data: validationResult.data,
        };
      }
}
