import { inject, injectable } from "inversify";
import { DbGateway } from "../../../Services/DbGateway";
import { UserAuthSchema } from "./DBSchemas/UserAuthSchema";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "../../../Types/RepositoryTypes";
import { z } from "zod";
import { TYPES } from "/Shared/Types";

@injectable()
export class AuthRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async findByEmail(
    email: string,
  ): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
    const result = await this.dbGateway.query(
      "SELECT * FROM UsersAuth WHERE email = $1",
      [email],
    );

    if (!result.dbSuccess)
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };

    if (result.data.length === 0)
      return {
        status: RepositoryResultStatus.failed,
        messages: ["User not found!"],
      };

      console.log(result.data[0]);

    const user = result.data[0];
    const validationResult = UserAuthSchema.safeParse(user);

    if (!validationResult.success)
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };

    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }
  
  public async findById(
    id: number,
  ): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
    const result = await this.dbGateway.query(
      "SELECT * FROM UsersAuth WHERE id = $1",
      [id],
    );

    if (!result.dbSuccess)
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };

    if (result.data.length === 0)
      return {
        status: RepositoryResultStatus.failed,
        messages: ["User not found!"],
      };

    const user = result.data[0];
    const validationResult = UserAuthSchema.safeParse(user);

    if (!validationResult.success)
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };

    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }

  public async create(data: {
    email: string;
    pass_hash: string;
  }): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
    const result = await this.dbGateway.query(
      "INSERT INTO UsersAuth (email, pass_hash, hasset2fa) VALUES ($1, $2, false) RETURNING *",
      [data.email, data.pass_hash],
    );

    if (!result.dbSuccess)
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };

    if (result.data.length === 0)
      return {
        status: RepositoryResultStatus.failed,
        messages: ["User not created!"],
      };

    const newUser = result.data[0];
    const validationResult = UserAuthSchema.safeParse(newUser);

    if (!validationResult.success)
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };

    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }

  public async updateHasSet2FA(
    id: number,
    hasSet2FA: boolean,
  ): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
    const result = await this.dbGateway.query(
      "UPDATE UsersAuth SET hasSet2FA = $1 WHERE id = $2 RETURNING *",
      [hasSet2FA, id],
    );

    if (!result.dbSuccess)
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };

    if (result.data.length === 0)
      return {
        status: RepositoryResultStatus.failed,
        messages: ["User not found!"],
      };

    const updatedUser = result.data[0];
    const validationResult = UserAuthSchema.safeParse(updatedUser);

    if (!validationResult.success)
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };

    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }
}
