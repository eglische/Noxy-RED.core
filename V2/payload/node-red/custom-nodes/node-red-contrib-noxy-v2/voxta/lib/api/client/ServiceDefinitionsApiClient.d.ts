import { ModuleDefinitionsResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
export declare class ServiceDefinitionsApiClient extends VoxtaApiClientBase {
    getServiceDefinitions(): Promise<ModuleDefinitionsResponse>;
}
