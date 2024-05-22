import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { ActivitiesValidator, LoginData, RegisterData } from "./ActivitiesValidator";
import { ActivitiesRepository } from "./Repositories/ActivitiesRepository";
import { RepositoryResultStatus } from "../../Types/RepositoryTypes";

@injectable()
export class ActivitiesController {
  //@inject(TYPES.ActivitiesValidator)
  //private readonly activitiesValidator!: ActivitiesValidator;

  @inject(TYPES.ActivitiesRepository)
  private readonly activitiesRepository!: ActivitiesRepository;

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

      if (!user_id || !activity_id) {
        return res.json({
          success: false,
          errors: ["user_id and activity_id are required"],
        });
      }

      const result = await this.activitiesRepository.getExecutedActivityStats(Number(user_id), Number(activity_id));
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
          message: "Executed activities not found",
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

        if (!user_id) {
          return res.json({
            success: false,
            errors: ["user_id is required"],
          });
        }

        const result = await this.activitiesRepository.aggregateUserStats(Number(user_id));
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
