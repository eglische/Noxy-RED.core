import { CulturesResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
export declare class CulturesApiClient extends VoxtaApiClientBase {
    getCultures(): Promise<CulturesResponse>;
}
