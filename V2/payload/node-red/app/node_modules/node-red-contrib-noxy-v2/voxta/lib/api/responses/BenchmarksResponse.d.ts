import { BenchmarkResultData, BenchmarkStatus } from './BenchmarkResultResponse';
export interface BenchmarksResponse {
    categories: BenchmarkCategory[];
}
export interface BenchmarkCategory {
    id: string;
    label: string;
    description: string;
    items: BenchmarkItem[];
    disabled?: boolean;
}
export interface BenchmarkItem {
    id: string;
    label: string;
    description: string;
    score: number;
    iterations: number;
    status: BenchmarkStatus;
    results?: BenchmarkResultData[];
    stats?: {
        duration: number;
        score: number;
    };
    actualIterations?: number;
    disabled?: boolean;
}
