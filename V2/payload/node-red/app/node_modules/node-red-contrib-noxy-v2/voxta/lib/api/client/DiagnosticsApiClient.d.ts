import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { DiagnosticKeyResponse, DiagnosticsResponse } from '../responses';
export declare class DiagnosticsApiClient extends VoxtaApiClientBase {
    getDiagnostics(): Promise<DiagnosticsResponse>;
    getDiagnosticsKey(key: string, id?: string): Promise<DiagnosticKeyResponse>;
    clearDiagnostics(): Promise<void>;
}
