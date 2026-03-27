import { FormField } from '../form';
export interface ModuleResponse {
    id: string;
    serviceName: string;
    serviceLabel: string;
    required: boolean;
    installable: boolean;
    helpLink?: string;
    userLabel?: string;
    fields: FormField[];
    values: Record<string, string>;
}
