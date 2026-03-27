import { FormChoicesField } from './FormChoicesField';
export interface FormPromptTemplatesField extends Omit<FormChoicesField, '$type'> {
    $type: 'promptTemplates';
}
