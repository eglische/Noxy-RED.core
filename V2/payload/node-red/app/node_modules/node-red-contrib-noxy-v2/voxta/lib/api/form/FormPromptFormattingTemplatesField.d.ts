import { FormChoicesField } from './FormChoicesField';
export interface FormPromptFormattingTemplatesField extends Omit<FormChoicesField, '$type'> {
    $type: 'promptFormattingTemplates';
}
