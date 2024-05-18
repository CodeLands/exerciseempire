import { inject, injectable } from 'inversify';
import { DbGateway } from '../Services/DbGateway';
import { TYPES } from '/Shared/Types';
import { UserSchema } from '../ValidationSchemas/UserSchema';
import { RepositiryResult } from '/Types/Repository';
import { z } from 'zod';

const dbGateway = new DbGateway;

@injectable()
export class AuthRepository {

    public async findByEmail(email: string): Promise<RepositiryResult<z.infer<typeof UserSchema>>> {
        const result = await dbGateway.query('SELECT * FROM users WHERE email = $1', [email]);

        if(!result.success)
          return result

        if (result.data.rows.length === 0) 
          return {
            success: false,
            errors: ["No user with this email!"]
          }
        const user = result.data.rows[0];
    
        const validationResult = UserSchema.safeParse(user);
    
        if (!validationResult.success) 
          return {
            success: false,
            errors: ["Invalid data from database!"]
          }
    
        return { success: true,
          data: validationResult.data
      }
    }

      public async create(data: { email: string; password_hash: string }): Promise<RepositiryResult<z.infer<typeof UserSchema>>> {
        const result = await dbGateway.query(
          'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
          [data.email, data.password_hash]
        );

        if(!result.success)
          return result
    
        if (result.data.rows.length === 0) 
          return {
            success: false,
            errors: ["User wasn't created!"]
          }

        const newUser = result.data.rows[0];
    
        // Validate the newly created user data
        const validationResult = UserSchema.safeParse(newUser);
    
        if (!validationResult.success)
          return {
          success: false,
          errors: ["Invalid data from database!"]
        }
    
        return {
          success: true,
          data: validationResult.data
        }
      }
}