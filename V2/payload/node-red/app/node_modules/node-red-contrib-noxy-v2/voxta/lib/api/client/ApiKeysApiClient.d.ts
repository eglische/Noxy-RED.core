import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ApiKeysResponse, VoxtaApiKeyCreatedResponse } from '../responses';
export declare class ApiKeysApiClient extends VoxtaApiClientBase {
    getApiKeys(): Promise<ApiKeysResponse>;
    createApiKey(name: string, scopes: string[]): Promise<VoxtaApiKeyCreatedResponse>;
    deleteApiKey(id: string): Promise<void>;
}
