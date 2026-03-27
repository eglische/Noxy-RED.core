import { MessageData } from '../../shared';
export interface BenchmarkResultResponse {
    testId: string;
    status: BenchmarkStatus;
    result?: BenchmarkResultData;
}
export interface BenchmarkResultData {
    status: BenchmarkStatus;
    duration: number;
    messages?: MessageData[];
    rawResponse?: string;
    response?: string;
    error?: string;
    score: number;
    serviceName?: string;
    parameters?: string;
}
export declare enum BenchmarkStatus {
    Unknown = "Unknown",
    Pending = "Pending",
    Running = "Running",
    Success = "Success",
    PartialSuccess = "PartialSuccess",
    Failure = "Failure",
    Error = "Error",
    Canceled = "Canceled"
}
