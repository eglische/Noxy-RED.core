import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { AppsResponse } from '../responses';
import { App } from '../model';
export declare class AppsApiClient extends VoxtaApiClientBase {
    getApps(): Promise<AppsResponse>;
    getApp(clientId: string): Promise<App>;
    deleteApp(clientId: string): Promise<void>;
}
