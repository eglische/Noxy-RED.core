import { FormFieldBase } from './FormFieldBase';
export interface FormMultilineField extends FormFieldBase {
    $type: 'multiline';
    required: boolean;
    rows: number;
    defaultValue?: string;
    placeholder?: string;
}
