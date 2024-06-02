import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { FaceIdData, FaceIdSetupResult, FaceIdValidateResult, FaceIdValidator } from "./FaceIdValidator";
import { JwtGateway } from "../Services/JwtGateway";
import axiosInstance from "/App/Services/AxiosGateway";
import { AuthFactorType } from "../Types/FactorAuthType";
import { RequestWithUser } from "../AuthMiddleware";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

type FaceIdRequest = MulterRequest & RequestWithUser

@injectable()
export class FaceIdController {
  @inject(TYPES.FaceIdValidator)
  private readonly faceIdValidator!: FaceIdValidator;

  @inject(TYPES.JwtGateway)
  private readonly jwtGateway!: JwtGateway;

  public faceIdLogin = async (req: FaceIdRequest, res: Response) => {
    if (!req.file)
      return res.json({ success: false, errors: ["Video is required"] });

    let payload: FaceIdData | null = {
        video: req.file.buffer.toString("base64"),
    };

    const validatedPayload = this.faceIdValidator.FaceDataValidate(
        payload.video
    );
    payload = null;
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
    });

    // TODO check if user has face registered in db

    try {
        const response = await axiosInstance.post(`/login-face?userId=${req.userId}`, validatedPayload.data.video);

        let pythonPayload: FaceIdValidateResult | null = {
            wasRecognized: response.data.recognized,
        };
    
        const pythonValidatedPayload = this.faceIdValidator.FaceResultValidate(
            pythonPayload.wasRecognized
        );
        pythonPayload = null;
        if (!pythonValidatedPayload.success)
          return res.json({
            success: false,
            errors: [...pythonValidatedPayload.errors,
                "Invalid face recognition result from python server."
            ]
        });

        if (response.data.recognized) {
            const tempAuthToken = this.jwtGateway.jwtSign({
                sub: req.userId,
                step: AuthFactorType.secondFactor
              }, {
                expiresIn: "8h",
                
              });

            res.json({
                success: true,
                message: "User Completed Second Factor Authentication!",
                data: {
                  token: tempAuthToken,
                },
              });
        } else {
            res.status(401).send("Face not recognized. Access denied.");
        }
    } catch (error) {
        console.error('Express Error: Face Login: ', error);
        res.status(500).send("Express Error: Face Login: " + error);
    }
  };
  
  public faceIdRegister = async (req: FaceIdRequest, res: Response) => {
    if (!req.file)
      return res.json({ success: false, errors: ["Video is required"] });

    let payload: FaceIdData | null = {
        video: req.file.buffer.toString("base64"),
    };

    const validatedPayload = this.faceIdValidator.FaceDataValidate(
        payload.video
    );
    payload = null;
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
    });

    // TODO check if user has face registered in db

    try {
        const response = await axiosInstance.post(`/register-face?userId=${req.userId}`, validatedPayload.data.video);

        let pythonPayload: FaceIdSetupResult | null = {
            wasSetup: response.data.wasSetup,
        };
    
        const pythonValidatedPayload = this.faceIdValidator.FaceResultSetup(
            pythonPayload.wasSetup
        );
        pythonPayload = null;
        if (!pythonValidatedPayload.success)
          return res.json({
            success: false,
            errors: [...pythonValidatedPayload.errors,
                "Invalid face recognition result from python server."
            ]
        });

        if (response.data.recognized) {
            const tempAuthToken = this.jwtGateway.jwtSign({
                sub: req.userId,
                step: AuthFactorType.secondFactor
              }, {
                expiresIn: "8h",
                
              });

            res.json({
                success: true,
                message: "User Completed Second Factor Authentication Setup!",
                data: {
                  token: tempAuthToken,
                },
              });
        } else {
            res.status(401).send("Face not recognized. Access denied.");
        }
    } catch (error) {
        console.error('Express Error: Face Login: ', error);
        res.status(500).send("Express Error: Face Login: " + error);
    }
  };
}
