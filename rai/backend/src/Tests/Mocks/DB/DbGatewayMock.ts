import { injectable } from "inversify";
import { DBResult, IDBGateway } from "/App/Services/DbGateway";

@injectable()
export class DbGatewayMock implements IDBGateway{
    
    public query: jest.Mock<Promise<DBResult>, [string, any[]?]> = jest.fn();

};