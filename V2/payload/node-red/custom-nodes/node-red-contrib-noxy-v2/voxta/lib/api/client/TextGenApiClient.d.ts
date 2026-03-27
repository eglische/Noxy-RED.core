import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { TextGenRequest } from '../requests';
export declare class TextGenApiClient extends VoxtaApiClientBase {
    generateText(request: TextGenRequest, callback: (message: {
        text: string;
    }) => void): Promise<void>;
    countTokens(text: string): Promise<{
        tokens: number;
    }>;
}
