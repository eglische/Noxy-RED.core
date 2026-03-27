import { ContextDefinition } from './ContextDefinition';
export interface ActionEffect {
    script?: string;
    setFlags?: string[];
    effect?: string;
    instructions?: string;
    note?: string;
    secret?: string;
    event?: string;
    story?: string;
    contexts?: ContextDefinition[];
    maxSentences?: number;
    maxTokens?: number;
    trigger?: string;
}
