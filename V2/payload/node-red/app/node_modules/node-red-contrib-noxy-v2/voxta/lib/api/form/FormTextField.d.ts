import { FormFieldBase } from './FormFieldBase';
export interface FormTextField extends FormFieldBase {
    $type: 'text';
    required: boolean;
    defaultValue?: string;
    placeholder?: string;
    validationRegex?: string;
}
