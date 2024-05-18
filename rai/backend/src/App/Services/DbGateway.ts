import { injectable } from 'inversify';
import { Pool, QueryResult } from 'pg';

type SuccessDB = {
    success: true,
    data: QueryResult<any>
}

export type FailedDB = {
    success: false,
    errors: unknown[]
}

type DBResult = SuccessDB | FailedDB

@injectable()
export class DbGateway {
    public pool: Pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    async query(query: string, params?: any[]): Promise<DBResult> {
        try {
            const result = await this.pool.query(query, params);
            return {
                success: true,
                data: result
            }
        } catch (error: unknown) {
            // Handle the error here, e.g. log the error or throw a custom error
            console.error('An error occurred while executing the database query:', error);
            return {
                success: false,
                errors: [ error ]
            }
        }
    }
}

