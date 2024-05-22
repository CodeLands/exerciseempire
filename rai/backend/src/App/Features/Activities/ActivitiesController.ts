import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { ActivitiesValidator, LoginData, RegisterData } from "./ActivitiesValidator";
import { ActivitiesRepository } from "../../Repositories/ActivitiesRepository";
import { RepositoryResultStatus } from "/App/Repositories/Types/RepositoryTypes";

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
}
