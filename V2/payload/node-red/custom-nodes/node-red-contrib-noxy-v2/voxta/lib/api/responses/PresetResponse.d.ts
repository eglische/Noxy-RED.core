import { FormField } from '../form';
import { ServiceTypes } from '../../shared/ServiceTypes';
export interface PresetResponse {
    id: string;
    readOnly: boolean;
    serviceName: string;
    serviceType: ServiceTypes;
    label: string;
    description: string;
    fields: FormField[];
    values: Record<string, string>;
}
