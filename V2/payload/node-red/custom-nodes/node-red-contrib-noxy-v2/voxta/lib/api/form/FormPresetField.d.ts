import { ServiceTypes } from '../../shared/ServiceTypes';
import { FormChoicesField } from './FormChoicesField';
export interface FormPresetField extends Omit<FormChoicesField, '$type'> {
    $type: 'preset';
    serviceName: string;
    serviceType: ServiceTypes;
}
