import { FormFieldBase } from './FormFieldBase';
export interface FormDocumentationField extends FormFieldBase {
    $type: 'documentation';
    value: string;
}
