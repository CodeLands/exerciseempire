import "reflect-metadata";
import request from "supertest";
import express from "express";
import { createApp } from "/Shared/BaseApp";
import { testContainer } from "../../../../Tests/TestContainer";
import { DbGatewayMock } from "../../../../Tests/Mocks/DB/DbGatewayMock";
import { TYPES } from "/Shared/Types";
import { ActivitiesValidator } from "../ActivitiesValidator";
import { ActivitiesRepository } from "/App/Repositories/ActivitiesRepository";

// Setup of Controller Dependencies
// Mocks
let dbGateway: DbGatewayMock = null!;

// Dependencies + Spies
let activitiesValidator: ActivitiesValidator = null!;
let activitiesRepository: ActivitiesRepository = null!;

// App
let testApp: express.Application;

beforeAll(() => {
  dbGateway = testContainer.get(TYPES.DbGateway);

  activitiesValidator = testContainer.get(TYPES.ActivitiesValidator);

  activitiesRepository = testContainer.get(TYPES.ActivitiesRepository);

  testApp = createApp(testContainer);
});

describe("Activities Routes:", () => {
  // beforeEach(() => {

  // });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("/activities Route", () => {
    describe("Successful cases:", () => {
      it("should fetch activities from the database", async () => {
        const dbMockedDataGetActivities = [
          {
            category: "Outdoor",
            activity_id: 1,
            activity: "Running",
            category_id: 1,
            stat: "Endurance",
            base_stat_value: 70
          },
          {
            category: "Outdoor",
            activity_id: 1,
            activity: "Running",
            category_id: 1,
            stat: "Speed",
            base_stat_value: 80
          },
          {
            category: "Water Sports",
            activity_id: 2,
            activity: "Swimming",
            category_id: 3,
            stat: "Endurance",
            base_stat_value: 85
          },
          {
            category: "Outdoor",
            activity_id: 3,
            activity: "Cycling",
            category_id: 1,
            stat: "Endurance",
            base_stat_value: 75
          },
          {
            category: "Outdoor",
            activity_id: 3,
            activity: "Cycling",
            category_id: 1,
            stat: "Strength",
            base_stat_value: 60
          }
        ];

        dbGateway.query = jest.fn().mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedDataGetActivities,
        });

        const response = await request(testApp).get("/activities");

        expect(response.body).toEqual({
          success: true,
          message: "Getting activities",
          data: [
                    {
                      category: "Outdoor",
                      activities: [
                        {
                          id: 1,
                          activity: "Running",
                          category_id: 1,
                          stats: [
                            { stat: "Endurance", base_stat_value: 70 },
                            { stat: "Speed", base_stat_value: 80 }
                          ]
                        },
                        {
                          id: 3,
                          activity: "Cycling",
                          category_id: 1,
                          stats: [
                            { stat: "Endurance", base_stat_value: 75 },
                            { stat: "Strength", base_stat_value: 60 }
                          ]
                        }
                      ]
                    },
                    {
                      category: "Water Sports",
                      activities: [
                        {
                          id: 2,
                          activity: "Swimming",
                          category_id: 3,
                          stats: [
                            { stat: "Endurance", base_stat_value: 85 }
                          ]
                        }
                      ]
                    }
                  ]
        });
      });
    });
  });
});
