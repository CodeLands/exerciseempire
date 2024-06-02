import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { AuthValidator, LoginData, RegisterData } from "./AuthValidator";
import { AuthRepository } from "./Repositories/AuthRepository";
import { AuthGateway } from "./Services/AuthGateway";
import { JwtGateway } from "./Services/JwtGateway";
import { RepositoryResultStatus } from "../../Types/RepositoryTypes";


@injectable()
export class AuthController {
  @inject(TYPES.AuthValidator)
  private readonly authValidator!: AuthValidator;

  @inject(TYPES.AuthRepository)
  private readonly authRepository!: AuthRepository;

  @inject(TYPES.AuthGateway)
  private readonly authGateway!: AuthGateway;

  @inject(TYPES.JwtGateway)
  private readonly jwtGateway!: JwtGateway;

  public login = async (req: Request, res: Response) => {
    let payload: LoginData | null = {
      email: req.body.email,
      password: req.body.password,
    };

    const validatedPayload = this.authValidator.loginDataValidate(
      payload.email,
      payload.password,
    );
    payload = null;
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });

    const repoResultCheckIfUserExists = await this.authRepository.findByEmail(
      validatedPayload.data.email,
    );

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultCheckIfUserExists.errors,
      });

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["DB: User not found!"],
      });

    const validPassword = await this.authGateway.comparePassword(
      validatedPayload.data.password,
      repoResultCheckIfUserExists.data.pass_hash,
    );
    if (!validPassword)
      return res.json({ success: false, errors: ["Invalid password"] });

    const tempAuthToken = this.jwtGateway.jwtSign({
      sub: repoResultCheckIfUserExists.data.id,
      step: "login",
    }, {
      expiresIn: "10min",
      
    });
    res.json({
      success: true,
      message: "User Completed First Factor Authentication!",
      data: {
        token: tempAuthToken,
      },
    });
  };

  public register = async (req: Request, res: Response) => {
    let payload: RegisterData | null = {
      email: req.body.email,
      password: req.body.password,
      repeatPassword: req.body.repeatPassword,
    };

    const validatedPayload = this.authValidator.registerDataValidate(
      payload.email,
      payload.password,
      payload.repeatPassword,
    );
    payload = null;
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });

    const repoResultCheckIfUserExists = await this.authRepository.findByEmail(
      validatedPayload.data.email,
    );
    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultCheckIfUserExists.errors,
      });

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.success)
      return res.json({
        success: false,
        errors: ["User already exists!"],
      });

    const password_hash = await this.authGateway.hashPassword(
      validatedPayload.data.password,
    );
    const repoResultCreatedUser = await this.authRepository.create({
      email: validatedPayload.data.email,
      pass_hash: password_hash,
    });

    if (repoResultCreatedUser.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultCreatedUser.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: ["Database Validation Error!"],
      });

    if (repoResultCreatedUser.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["Failed to create user!"],
      });

      const tempAuthToken = this.jwtGateway.jwtSign({
        sub: repoResultCreatedUser.data.id,
        step: "login",
      }, {
        expiresIn: "10min",
      });

      res.json({
      success: true,
      message: "User Registered and completed First Factor Authentication!",
      data: {
        tempAuthToken,
      },
    });
  };
}
