import { Router } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "/Shared/Types";
import { ActivitiesController } from "./ActivitiesController";

@injectable()
export class ActivitiesRouter {
  @inject(TYPES.ActivitiesController)
  private readonly activitiesController!: ActivitiesController;

  public defineActivitiesRoutes(router: Router) {
    router.get("/activities", this.activitiesController.listActivities);
    router.get("/activity-stats", this.activitiesController.getActivityStats);
    router.get("/aggregate-stats", this.activitiesController.aggregateUserStats);
  }
}
