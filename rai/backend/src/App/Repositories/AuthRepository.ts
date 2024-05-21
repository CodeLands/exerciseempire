import { inject, injectable } from 'inversify';
import { DbGateway } from '../Services/DbGateway';
import { UserAuthSchema } from './DBSchemas/UserSchema';
import { RepositoryResultStatus, RepositoryResult } from './Types/RepositoryTypes';
import { z } from 'zod';
import { TYPES } from '/Shared/Types';

@injectable()
export class AuthRepository {

  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

    public async findByEmail(email: string): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
      const result = await this.dbGateway.query('SELECT * FROM UsersAuth WHERE email = $1', [email]);

      if(!result.dbSuccess)
        return {
          status: RepositoryResultStatus.dbError,
          errors: ["Database error!"]
        }

      if(result.data.length === 0)
        return {
          status: RepositoryResultStatus.failed,
          messages: ["User not found!"]
        }

      const user = result.data[0];
      const validationResult = UserAuthSchema.safeParse(user);

      if (!validationResult.success) 
        return {
          status: RepositoryResultStatus.zodError,
          errors: ["Invalid data from database!", ...validationResult.error.errors.map(e => e.message)]
        }
  
      return {
        status: RepositoryResultStatus.success,
        data: validationResult.data
      }
    }

      public async create(data: { email: string; password_hash: string }): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
        const result = await this.dbGateway.query(
          'INSERT INTO UsersAuth (email, password_hash) VALUES ($1, $2) RETURNING *',
          [data.email, data.password_hash]
        );

        if(!result.dbSuccess)
          return {
            status: RepositoryResultStatus.dbError,
            errors: ["Database error!"]
          }
    
        if (result.data.length === 0) 
          return {
            status: RepositoryResultStatus.failed,
            messages: ["User not created!"]
          }

        const newUser = result.data[0];
        const validationResult = UserAuthSchema.safeParse(newUser);
    
        if (!validationResult.success)
          return {
            status: RepositoryResultStatus.zodError,
            errors: ["Invalid data from database!", ...validationResult.error.errors.map(e => e.message)]
          }
    
        return {
          status: RepositoryResultStatus.success,
          data: validationResult.data
        }
      }
}