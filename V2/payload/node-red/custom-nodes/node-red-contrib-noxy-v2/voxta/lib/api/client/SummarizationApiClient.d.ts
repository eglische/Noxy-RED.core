import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { MemoryExtractResponse, MemoryMergeResponse } from '../responses';
import { MemoryExtractRequest, MemoryMergeRequest } from '../requests';
export declare class SummarizationApiClient extends VoxtaApiClientBase {
    extract(request: MemoryExtractRequest): Promise<MemoryExtractResponse>;
    merge(request: MemoryMergeRequest): Promise<MemoryMergeResponse>;
}
