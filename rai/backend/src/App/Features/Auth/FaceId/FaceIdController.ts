import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { FaceIdData, FaceIdSetupResult, FaceIdValidateResult, FaceIdValidator } from "./FaceIdValidator";
import { JwtGateway } from "../Services/JwtGateway";
import axiosInstance from "/App/Services/AxiosGateway";
import { AuthFactorType } from "../Types/FactorAuthType";
import { RequestWithUser } from "../AuthMiddleware";
import { AuthRepository } from "../Repositories/AuthRepository";
import { RepositoryResultStatus } from "/App/Types/RepositoryTypes";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

type FaceIdRequest = MulterRequest & RequestWithUser

@injectable()
export class FaceIdController {
  @inject(TYPES.FaceIdValidator)
  private readonly faceIdValidator!: FaceIdValidator;

  @inject(TYPES.AuthRepository)
    private readonly authRepository!: AuthRepository;

  @inject(TYPES.JwtGateway)
  private readonly jwtGateway!: JwtGateway;

  public faceIdLogin = async (req: FaceIdRequest, res: Response) => {
    console.log('FaceIdLogin Request:', req.userId, req.authStep);

    if (!req.userId || !req.authStep)
      return res.json({ success: false, errors: ["User not logged in"] });

    if (!req.file || !req.file.buffer)
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

    const repoResultFindUserById = await this.authRepository.findById(
        req.userId
      );
  
      if (repoResultFindUserById.status === RepositoryResultStatus.dbError)
        return res.json({
          success: false,
          errors: ["Database Error!"],
        });
  
      if (repoResultFindUserById.status === RepositoryResultStatus.zodError)
        return res.json({
          success: false,
          errors: repoResultFindUserById.errors,
        });
  
      if (repoResultFindUserById.status === RepositoryResultStatus.failed)
        return res.json({
          success: false,
          errors: ["DB: User not found!"],
        });

    if (!repoResultFindUserById.data.hasset2fa)
        return res.json({
            success: false,
            errors: ["User has not registered face yet!"],
        });

    try {
        let response = await axiosInstance.post(`/login-face?userId=${req.userId}`, validatedPayload.data.video);
    
        //console.log('Python response: ', response);
        console.log('Python response data: ', response.data);

        let pythonPayload: FaceIdValidateResult | null = {
            success: response.data.success,
            wasRecognized: response.data.wasRecognized,
            message: response.data.message,
        };
        response = null!
    
        const pythonValidatedPayload = this.faceIdValidator.FaceResultValidate(
            pythonPayload.success,
            pythonPayload.message,
            pythonPayload.wasRecognized
        );
        pythonPayload = null;
        if (!pythonValidatedPayload.success)
          return res.json({
            success: false,
            errors: [...pythonValidatedPayload.errors,
                "Invalid login face id result from python server."
            ]
        });

        if (pythonValidatedPayload.data.wasRecognized) {
            const tempAuthToken = this.jwtGateway.jwtSign({
                sub: req.userId,
                step: AuthFactorType.secondFactor
              }, {
                expiresIn: "24h",
                
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
        /* console.error('Express Error: Face Login: ', error); */
        res.status(500).send("Express Error: Face Login: " + error);
    }
  };
  
  public faceIdRegister = async (req: FaceIdRequest, res: Response) => {
    console.log('FaceIdRegister Request:', req.userId, req.authStep);
    
    if (!req.userId || !req.authStep)
      return res.json({ success: false, errors: ["User not logged in"] });

    if (!req.file || !req.file.buffer)
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

    try {
        let response = await axiosInstance.post(`/register-face?userId=${req.userId}`, validatedPayload.data.video);

        // Check if response is valid
        if (response.status !== 200) {
          console.error('Invalid response from python server: ', response);
            return res.json({
                success: false,
                errors: ["Invalid response from python server."]
            });
          }
        

        let pythonPayload: FaceIdSetupResult | null = {
          success: response.data.success,
          message: response.data.message,
            wasSetup: response.data.wasSetup,
        };
        response = null!
    
        const pythonValidatedPayload = this.faceIdValidator.FaceResultSetup(
            pythonPayload.success,
            pythonPayload.message,
            pythonPayload.wasSetup
        );
        pythonPayload = null;
        if (!pythonValidatedPayload.success)
          return res.json({
            success: false,
            errors: [...pythonValidatedPayload.errors,
                "Invalid setup face id result from python server."
            ]
        });

        if (pythonValidatedPayload.data.wasSetup) {

            const repoResultFindUserById = await this.authRepository.findById(
                req.userId
              );
          
              if (repoResultFindUserById.status === RepositoryResultStatus.dbError)
                return res.json({
                  success: false,
                  errors: ["Database Error!"],
                });
          
              if (repoResultFindUserById.status === RepositoryResultStatus.zodError)
                return res.json({
                  success: false,
                  errors: repoResultFindUserById.errors,
                });
          
              if (repoResultFindUserById.status === RepositoryResultStatus.failed)
                return res.json({
                  success: false,
                  errors: ["DB: User not found!"],
                });

            if (repoResultFindUserById.data.hasset2fa)
                return res.json({
                    success: false,
                    errors: ["User has already registered face!"],
                });
            else {
                const repoResultUpdateUser = await this.authRepository.updateHasSet2FA(
                    req.userId,
                    true
                );
            
                if (repoResultUpdateUser.status === RepositoryResultStatus.dbError)
                  return res.json({
                    success: false,
                    errors: ["Database Error!"],
                  });
            
                if (repoResultUpdateUser.status === RepositoryResultStatus.zodError)
                  return res.json({
                    success: false,
                    errors: repoResultUpdateUser.errors,
                  });
            
                if (repoResultUpdateUser.status === RepositoryResultStatus.failed)
                  return res.json({
                    success: false,
                    errors: ["DB: User not found!"],
                  });
            }

            const tempAuthToken = this.jwtGateway.jwtSign({
                sub: req.userId,
                step: AuthFactorType.secondFactor
              }, {
                expiresIn: "24h",
                
              });

            res.json({
                success: true,
                message: "User Completed Second Factor Authentication Setup!",
                data: {
                  token: tempAuthToken,
                },
              });
        } else {
            res.status(401).send("Face ID couldnt be setup.");
        }
    } catch (error) {
        /* console.error('Express Error: Face Register: ', error); */
        res.status(500).send("Express Error: Face Register: " + error);
    }
  };

/*   public faceIdDelete = async (req: RequestWithUser, res: Response) => {
    if (!req.userId || !req.authStep)
      return res.json({ success: false, errors: ["User not logged in"] });  

      try {
          let response = await axiosInstance.post(`/delete-face?userId=${req.userId}`);
  
          let pythonPayload: FaceIdSetupResult | null = {
              wasSetup: response.data.wasSetup,
          };
          response = null!
      
          const pythonValidatedPayload = this.faceIdValidator.FaceResultSetup(
              pythonPayload.wasSetup
          );
          pythonPayload = null;
          if (!pythonValidatedPayload.success)
          return res.json({
              success: false,
              errors: [...pythonValidatedPayload.errors,
                  "Invalid remove face id result from python server."
              ]
          });
  
          if (pythonValidatedPayload.data.wasSetup) {
              const repoResultUpdateUser = await this.authRepository.updateHasSet2FA(
                  req.userId,
                  false
              );
          
              if (repoResultUpdateUser.status === RepositoryResultStatus.dbError)
              return res.json({
                  success: false,
                  errors: ["Database Error!"],
              });
          
              if (repoResultUpdateUser.status === RepositoryResultStatus.zodError)
              return res.json({
                  success: false,
                  errors: repoResultUpdateUser.errors,
              });
          
              if (repoResultUpdateUser.status === RepositoryResultStatus.failed)
              return res.json({
                  success: false,
                  errors: ["DB: User not found!"],
              });
  
              res.json({
                  success: true,
                  message: "User Removed 2FA!",
              });
          } else {
              res.status(401).send("Face id couldnt be removed.");
          }
      } catch (error) {
          //console.error('Express Error: Face Remove.: ', error);
          res.status(500).send("Express Error: Face Remove: " + error);
      }
  }; */

  public faceIdIsEnabled = async (req: RequestWithUser, res: Response) => {
    if (!req.userId || !req.authStep)
      return res.json({ success: false, errors: ["User not logged in"] });  

      const repoResultFindUserById = await this.authRepository.findById(
        req.userId
      );
  
      if (repoResultFindUserById.status === RepositoryResultStatus.dbError)
        return res.json({
          success: false,
          errors: ["Database Error!"],
        });
  
      if (repoResultFindUserById.status === RepositoryResultStatus.zodError)
        return res.json({
          success: false,
          errors: repoResultFindUserById.errors,
        });
  
      if (repoResultFindUserById.status === RepositoryResultStatus.failed)
        return res.json({
          success: false,
          errors: ["DB: User not found!"],
        });

    res.json({
        success: true,
        message: (repoResultFindUserById.data.hasset2fa ? "FaceId is set up!" : "FaceId is not set up!"),
        data: {
          has2fa: repoResultFindUserById.data.hasset2fa,
        },
      });
    }
}
