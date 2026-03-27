export interface ApiKeysResponse {
    apiKeys: VoxtaApiKeyItemResponse[];
}
export interface VoxtaApiKeyItemResponse {
    id: string;
    name: string;
    scopes: string[];
    dateCreated: string;
    dateCreatedAgo: string;
}
export interface VoxtaApiKeyCreatedResponse {
    id: string;
    name: string;
    scopes: string[];
    key: string;
}
