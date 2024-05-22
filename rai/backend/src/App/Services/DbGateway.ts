import { injectable } from 'inversify';
import { Pool, QueryResult } from 'pg';


export type SuccessDB = {
    dbSuccess: true,
    data: any[]
}

export type FailedDB = {
    dbSuccess: false,
    errors: unknown[]
}

export type DBResult = SuccessDB | FailedDB

export interface IDBGateway {
    query(query: string, params?: any[]): Promise<DBResult>;
}

@injectable()
export class DbGateway implements IDBGateway {
    public pool: Pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    async query(query: string, params?: any[]): Promise<DBResult> {
        try {
            const result = await this.pool.query(query, params);
            return {
                dbSuccess: true,
                data: result.rows
            }
        } catch (error: unknown) {
            // Handle the error here, e.g. log the error or throw a custom error
            console.error('An error occurred while executing the database query:', error);
            return {
                dbSuccess: false,
                errors: [ error ]
            }
        }
    }
}

