import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { RunBenchmarkRequest } from '../requests';
import { BenchmarksResponse, BenchmarkResultResponse } from '../responses';
export declare class BenchmarksApiClient extends VoxtaApiClientBase {
    getBenchmarks(): Promise<BenchmarksResponse>;
    runBenchmark(request: RunBenchmarkRequest): Promise<BenchmarksResponse>;
    cancelBenchmark(): Promise<BenchmarksResponse>;
    getBenchmarkStream(callback: (message: BenchmarkResultResponse) => void): Promise<void>;
}
