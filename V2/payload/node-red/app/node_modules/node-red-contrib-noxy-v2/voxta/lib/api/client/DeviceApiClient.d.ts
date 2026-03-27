import { VoxtaApiClientBase } from './VoxtaApiClientBase';
export declare class DeviceApiClient extends VoxtaApiClientBase {
    verify(request: {
        user_code: string;
    }): Promise<void>;
}
