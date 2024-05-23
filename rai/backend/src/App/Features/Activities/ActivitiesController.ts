import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { ActivitiesValidator } from "./ActivitiesValidator";
import { ActivitiesRepository } from "./Repositories/ActivitiesRepository";
import { RepositoryResultStatus } from "../../Types/RepositoryTypes";

@injectable()
export class ActivitiesController {
  @inject(TYPES.ActivitiesRepository)
  private readonly activitiesRepository!: ActivitiesRepository;

  @inject(TYPES.ActivitiesValidator)
  private readonly activitiesValidator!: ActivitiesValidator;

  public listActivities = async (req: Request, res: Response) => {
      const result = await this.activitiesRepository.listActivities();
      if (result.status === RepositoryResultStatus.dbError)
            return res.json({
              success: false,
              errors: ["Database Error!"],
      });
      if (result.status === RepositoryResultStatus.zodError)
        return res.json({
          success: false,
          errors: result.errors,
      });
      if (result.status === RepositoryResultStatus.failed) {
        return res.json({
          success: false,
          message: "Activities not found",
        })
      }
      return res.json({
          success: true,
          message: "Getting activities",
          data: result.data,
        });
  }

  public getActivityStats = async (req: Request, res: Response) => {
      const { user_id, activity_id } = req.query;

      const validation = this.activitiesValidator.getActivityStatsValidate(Number(user_id), Number(activity_id));
      if (!validation.success) {
        return res.json({
          success: false,
          errors: validation.errors,
        });
      }

      const result = await this.activitiesRepository.getExecutedActivityStats(validation.data.user_id, validation.data.activity_id);
      if (result.status === RepositoryResultStatus.dbError)
        return res.json({
          success: false,
          errors: ["Database Error!"],
        });
      if (result.status === RepositoryResultStatus.zodError)
        return res.json({
          success: false,
          errors: result.errors,
        });
      if (result.status === RepositoryResultStatus.failed) {
        return res.json({
          success: false,
          message: "No stats found",
        });
      }
      return res.json({
        success: true,
        message: "Getting executed activity stats",
        data: result.data,
      });
    }

    public aggregateUserStats = async (req: Request, res: Response) => {
      const { user_id } = req.query;

      const validation = this.activitiesValidator.aggregateUserStatsValidate(Number(user_id));
      if (!validation.success) {
        return res.json({
          success: false,
          errors: validation.errors,
        });
      }

      const result = await this.activitiesRepository.aggregateUserStats(validation.data.user_id);
      if (result.status === RepositoryResultStatus.dbError)
        return res.json({
          success: false,
          errors: ["Database Error!"],
        });
      if (result.status === RepositoryResultStatus.zodError)
        return res.json({
          success: false,
          errors: result.errors,
        });
      if (result.status === RepositoryResultStatus.failed) {
        return res.json({
          success: false,
          message: "No stats found",
        });
      }
      return res.json({
        success: true,
        message: "Aggregated user stats",
        data: result.data,
      });
    }
}
