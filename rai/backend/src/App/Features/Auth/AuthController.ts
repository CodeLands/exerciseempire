import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '/Shared/Types';
import { AuthValidator } from './AuthValidator';
import { AuthRepository } from '../../Repositories/AuthRepository';
import { AuthGateway } from '../../Services/AuthGateway';
import { JwtGateway } from '../../Services/JwtGateway';


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
    const { email, password } = req.body;

    const validationResult = this.authValidator.loginDataValidate(email, password);
    if(process.env.NODE_ENV === 'development'){
      if (!validationResult.success) {
      console.error(validationResult.errors);
      } else {
      console.log("Valid Login Payload:", validationResult.data);
      }
    }
    if (!validationResult.success) return res.status(400).json(validationResult);

    const user = await this.authRepository.findByEmail(email);
    if (!user.success) return res.status(400).json(user);

    const validPassword = await this.authGateway.comparePassword(password, user.data.pass_hash);
    if (!validPassword) return res.status(400).json({ success: false, errors: ["Invalid password"] });

    const token = this.jwtGateway.sign(user.data.id);
    res.json({ success: true, data: { token, message: "User Logged in Successfully!" } });
  };

  public register = async (req: Request, res: Response) => {
    const { email, password, repeatPassword } = req.body;

    const validationResult = this.authValidator.registerDataValidate(email, password, repeatPassword);
    if(process.env.NODE_ENV === 'development'){
      if (!validationResult.success) {
      console.error(validationResult.errors);
      } else {
      console.log("Valid Register Payload:", validationResult.data);
      }
    }
    if (!validationResult.success) return res.status(400).json(validationResult);

    const user = await this.authRepository.findByEmail(email);
    if (user) return res.status(400).json({ success: false, errors: ["User already exists"] });

    const passwordHash = await this.authGateway.hashPassword(password);
    const createdUser = await this.authRepository.create({ email, password_hash: passwordHash });

    if(!createdUser.success)
      return createdUser

    const token = this.jwtGateway.sign(createdUser.data.id);
    res.json({ success: true, data: { token, message: "User Registered Successfully!" } });
  };

  public logout = async (req: Request, res: Response) => {
    res.json({ success: true, message: "User Logged out Successfully!" });
  }
}

//export const authController = new AuthController;