import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { FrontEndInitResponse } from '../responses';
export declare class UIApiClient extends VoxtaApiClientBase {
    init(signin: boolean): Promise<FrontEndInitResponse>;
}
