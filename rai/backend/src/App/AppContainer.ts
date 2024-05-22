import { TYPES } from '/Shared/Types';
import { BaseContainer } from '../Shared/BaseContainer';
import { DbGateway } from './Services/DbGateway';
import { Container } from 'inversify';

const baseContainer: Container = new BaseContainer().buildBaseTemplate()

baseContainer.bind(TYPES.DbGateway).to(DbGateway);

export { baseContainer as appContainer }