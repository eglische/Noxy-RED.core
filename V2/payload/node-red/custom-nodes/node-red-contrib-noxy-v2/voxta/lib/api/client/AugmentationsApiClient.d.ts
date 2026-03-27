import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { AugmentationsResponse } from '../responses';
export declare class AugmentationsApiClient extends VoxtaApiClientBase {
    getAugmentations(): Promise<AugmentationsResponse>;
}
