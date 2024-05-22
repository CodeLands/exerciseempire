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
          id: 1,
          activity: "Running",
          category_id: 1,
          category: "Outdoor"
        },
        {
          id: 2,
          activity: "Swimming",
          category_id: 3,
          category: "Water Sports"
        },
        {
          id: 3,
          activity: "Cycling",
          category_id: 1,
          category: "Outdoor"
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
              "category": "Outdoor",
              "activities": [
                  {
                      "id": 1,
                      "activity": "Running",
                      "category_id": 1
                  },
                  {
                      "id": 3,
                      "activity": "Cycling",
                      "category_id": 1
                  }
              ]
            },
            {
              "category": "Water Sports",
              "activities": [
                  {
                      "id": 2,
                      "activity": "Swimming",
                      "category_id": 3
                  }
              ]
            }
          ]
        });
      });
    });
  });
});
