import { FormFieldBase } from './FormFieldBase';
export interface FormTitleField extends FormFieldBase {
    $type: 'title';
    value: string;
}
