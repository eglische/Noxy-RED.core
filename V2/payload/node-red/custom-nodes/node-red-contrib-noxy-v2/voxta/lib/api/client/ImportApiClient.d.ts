import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ImportResponse } from '../responses';
export declare class ImportApiClient extends VoxtaApiClientBase {
    importObject(file: File, overwrite: 'Skip' | 'Overwrite' | 'New'): Promise<ImportResponse>;
}
