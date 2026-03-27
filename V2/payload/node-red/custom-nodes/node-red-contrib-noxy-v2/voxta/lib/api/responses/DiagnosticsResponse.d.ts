import { MessageData, ServiceTypes } from '../../shared';
export interface DiagnosticsResponse {
    voxtaVersion: string;
    performanceMetrics: PerformanceMetricsViewModel[];
    textGen?: TextGenObserver[];
    storyWriter?: TextGenObserver[];
    characterActionInference?: ActionInferenceObserver[];
    userActionInference?: ActionInferenceObserver[];
    chatFlow?: ActionInferenceObserver[];
    summarization?: SummarizationObserver[];
    memoryExtraction?: SummarizationObserver[];
    memoryMerge?: SummarizationObserver[];
    computerVision?: ComputerVisionObserver[];
}
export interface PerformanceMetricsViewModel {
    key: string;
    avg: number;
    count: number;
}
export interface TextGenObserverBase {
    id: string;
    serviceName: string;
    timestamp: string;
    end: string;
    chunks: string[];
    messages: MessageData[];
    parameters?: string;
}
export interface TextGenObserver extends TextGenObserverBase {
}
export interface ActionInferenceObserver extends TextGenObserverBase {
    functions?: ScenarioActionInstance[];
}
export interface SummarizationObserver extends TextGenObserverBase {
}
export interface ComputerVisionObserver extends TextGenObserverBase {
}
export interface ScenarioActionInstance {
    name: string;
    description: string;
}
export interface DiagnosticKeyResponse {
    messages: MessageData[];
    serviceType: ServiceTypes;
}
