import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import {
  ActivitiesValidator,
  LoginData,
  RegisterData,
} from "./ActivitiesValidator";
import { ActivitiesRepository } from "../../Repositories/ActivitiesRepository";
import { RepositoryResultStatus } from "/App/Repositories/Types/RepositoryTypes";

@injectable()
export class ActivitiesController {
  @inject(TYPES.ActivitiesValidator)
  private readonly activitiesValidator!: ActivitiesValidator;

  @inject(TYPES.ActivitiesRepository)
  private readonly activitiesRepository!: ActivitiesRepository;

  public listActivities = async (req: Request, res: Response): Promise<void> => {
      const activities = await this.activitiesRepository.listActivities();
      res.json({ success: true, message: "Getting activities", activities });
  };

  // public logout = async (req: Request, res: Response) => {
  //   res.json({ success: true, message: "User Logged out Successfully!" });
  // }
}
