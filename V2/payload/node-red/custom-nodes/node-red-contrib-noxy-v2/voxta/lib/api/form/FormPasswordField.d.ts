import { FormFieldBase } from './FormFieldBase';
export interface FormPasswordField extends FormFieldBase {
    $type: 'password';
    required: boolean;
    placeholder?: string;
}
