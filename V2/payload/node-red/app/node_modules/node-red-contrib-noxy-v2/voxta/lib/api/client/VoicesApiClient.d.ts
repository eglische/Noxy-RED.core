import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { VoicesResponse } from '../responses';
export declare class VoicesApiClient extends VoxtaApiClientBase {
    getVoices(serviceId: string, characterId?: string, culture?: string): Promise<VoicesResponse>;
    getSpeechUrl(serviceId: string, characterId: string | undefined, culture: string, parameters: Record<string, string>, text: string): string;
}
