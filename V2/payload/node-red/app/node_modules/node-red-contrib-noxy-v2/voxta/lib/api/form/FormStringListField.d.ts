import { FormFieldBase } from './FormFieldBase';
export interface FormStringListField extends FormFieldBase {
    $type: 'list';
    rows: number;
    defaultValue?: string[];
}
