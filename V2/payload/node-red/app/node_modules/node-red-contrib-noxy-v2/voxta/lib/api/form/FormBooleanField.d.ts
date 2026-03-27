import { FormFieldBase } from './FormFieldBase';
export interface FormBooleanField extends FormFieldBase {
    $type: 'bool';
    defaultValue?: boolean;
    mustBeTrue?: boolean;
}
