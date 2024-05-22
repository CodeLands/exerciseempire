import { TYPES } from '../Shared/Types';
import { BaseContainer } from '../Shared/BaseContainer';
import { DbGatewayMock } from './Mocks/DB/DbGatewayMock';
import { Container } from 'inversify';

const baseContainer: Container = new BaseContainer().buildBaseTemplate()

baseContainer.bind(TYPES.DbGateway).to(DbGatewayMock).inSingletonScope();

export { baseContainer as testContainer };