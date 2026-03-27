export interface ValidationResults {
    isValid: boolean;
    results: ValidationError[];
}
export interface ValidationError {
    category: string;
    target: string;
    message: string;
    stacktrace?: string;
}
