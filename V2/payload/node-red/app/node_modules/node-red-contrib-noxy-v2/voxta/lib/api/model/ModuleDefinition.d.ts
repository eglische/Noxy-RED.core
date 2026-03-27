import { ServiceTypes } from '../../shared/ServiceTypes';
export interface ModuleDefinition {
    serviceName: string;
    label: string;
    required: boolean;
    single: boolean;
    supports: Partial<{
        [key in ServiceTypes]: ServiceDefinitionCategoryScore;
    }>;
    pricing: ServiceDefinitionPricing;
    hosting: ServiceDefinitionHosting;
    supportsExplicitContent: boolean;
    experimental: number;
    recommended: boolean;
    notes: string;
    pros: string;
    cons: string;
    serviceCount: number;
    augmentations: string[];
}
export declare enum ServiceDefinitionCategoryScore {
    NotSupported = 0,
    Low = 1,
    Medium = 2,
    High = 3
}
export declare enum ServiceDefinitionPricing {
    Free = 0,
    Low = 1,
    Medium = 2,
    High = 3
}
export declare enum ServiceDefinitionHosting {
    Builtin = 0,
    External = 1,
    Online = 2
}
