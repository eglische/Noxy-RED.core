import { FormFieldBase } from './FormFieldBase';
export interface FormDoubleField extends FormFieldBase {
    $type: 'double';
    defaultValue?: number;
    placeholder?: number;
    min?: number;
    max?: number;
}
