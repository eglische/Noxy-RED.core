import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ServiceTypes } from '../../shared';
import { UpdateServiceTypeRequest } from '../requests';
export declare class ServiceTypesApiClient extends VoxtaApiClientBase {
    updateServiceType(serviceType: ServiceTypes, request: UpdateServiceTypeRequest): Promise<void>;
}
