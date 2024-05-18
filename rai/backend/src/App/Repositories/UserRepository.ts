import { injectable } from 'inversify';
import { DbGateway, FailedDB } from '../Services/DbGateway';
import { UserSchema } from '../ValidationSchemas/UserSchema';
import { z } from 'zod';
import { RepositiryResult } from '/Types/Repository';

const dbGateway = new DbGateway

@injectable()
export class UserRepository {

  public async findAll(): Promise<RepositiryResult<z.infer<typeof UserSchema>[]>> {
    const result = await dbGateway.query('SELECT * FROM users');

    if(!result.success)
      return result

    const validationResult = z.array(UserSchema).safeParse(result);

    if (!validationResult.success)
      return {
    success: false,
    errors: ["Invalid user data from database"]
    }

    return {
      success: true,
      data: result.data.rows.map((user) => {
      return user.data
    })}
  }

  public async findById(id: number): Promise<RepositiryResult<z.infer<typeof UserSchema>>> {
    const result = await dbGateway.query('SELECT * FROM users WHERE id = $1', [id]);

    if(!result.success)
      return result

    if (result.data.rows.length === 0) {
      return {
        success: false,
        errors: ["No user was found"]
      };
    }
    const user = result.data.rows[0];

    const validationResult = UserSchema.safeParse(user);

    if (!validationResult.success)
      return {
        success: false,
        errors: ['Invalid user data from database']
      }

    return {
      success: true,
      data: validationResult.data
    }
  }

  public async update(id: number, data: { email: string; pass_hash: string }): Promise<RepositiryResult<z.infer<typeof UserSchema>>> {
    const result = await dbGateway.query(
      'UPDATE users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING *',
      [data.email, data.pass_hash, id]
    );

    if(!result.success)
      return result

    if (result.data.rows.length === 0) 
      return {
        success: false,
        errors: ['Failed to update user']
      }
      
    const updatedUser = result.data.rows[0];

    // Validate the updated user data
    const validationResult = UserSchema.safeParse(updatedUser);

    if (!validationResult.success)
      return {
        success: false,
        errors: ['Invalid user data from database']
      }

    return {
      success: true,
      data: validationResult.data
    }
  }

  public async delete(id: number): Promise<RepositiryResult<z.infer<typeof UserSchema>>> {
    const result = await dbGateway.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if(!result.success)
      return result

    if (result.data.rows.length === 0)
      return {
    success: false,
    errors: ['Failed to delete user']
  }
    const deletedUser = result.data.rows[0];

    // Validate the deleted user data
    const validationResult = UserSchema.safeParse(deletedUser);

    if (!validationResult.success)
      return {
        success: false,
        errors: ['Invalid user data from database']
      }

    return {
      success: true,
      data: validationResult.data
    }
  }
}
