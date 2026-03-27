import { FormFieldBase } from './FormFieldBase';
export interface FormIntListField extends FormFieldBase {
    $type: 'listOfInt';
    rows: number;
    defaultValue?: number[];
}
