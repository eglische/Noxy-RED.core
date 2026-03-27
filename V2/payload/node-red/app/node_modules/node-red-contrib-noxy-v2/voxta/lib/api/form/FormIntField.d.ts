import { FormFieldBase } from './FormFieldBase';
export interface FormIntField extends FormFieldBase {
    $type: 'int';
    defaultValue?: number;
    placeholder?: number;
    min?: number;
    max?: number;
}
