import { ServiceTypes } from '../../shared/ServiceTypes';
export type DiagnosticResultResponse = {
    [key in ServiceTypes]: DiagnosticResultItem[];
};
export interface DiagnosticResultItem {
    isReady: boolean;
    isHealthy: boolean;
    isTested: boolean;
    serviceName: string;
    moduleId: string;
    label: string;
    status: string;
    details?: string;
}
