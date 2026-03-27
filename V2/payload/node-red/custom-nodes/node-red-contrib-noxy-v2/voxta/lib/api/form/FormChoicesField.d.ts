import { FormFieldBase } from './FormFieldBase';
export interface FormChoicesField extends FormFieldBase {
    $type: 'choices';
    choices: Choice[];
    defaultValue?: string;
    allowCustomValue?: boolean;
}
export type Choice = {
    label: string;
    value: string;
};
