import { ServiceDefinitionCategoryScore, ServiceDefinitionPricing } from '../../api';
import { ServiceTypes } from '../../shared/ServiceTypes';
export type ServerConfigurationMessage = {
    $type: 'configuration';
    services: Partial<{
        [key in ServiceTypes]: ServicesList;
    }>;
    featureFlags: string[];
};
export type ServicesList = {
    enabled: boolean;
    defaultServiceId?: string;
    useClientCapability: boolean;
    services: ServicesListItemInfo[];
};
export type ServicesListItemInfo = {
    id: string;
    name: string;
    serviceLabel: string;
    enabled: boolean;
    required: boolean;
    single: boolean;
    userLabel?: string;
    score: ServiceDefinitionCategoryScore;
    pricing: ServiceDefinitionPricing;
    activePreset?: string;
    presets: {
        id: string;
        label: string;
    }[];
    augmentations: string[];
};
export declare function createUndefinedServicesListItemInfo(defaultServiceId: string): ServicesListItemInfo;
