import { ScenarioAction } from '../../api';
import { ContextDefinition } from '../../shared/ContextDefinition';
export interface ClientDoChatMessage {
    contextKey?: string;
    contexts?: ContextDefinition[];
    actions?: ScenarioAction[];
    flags?: string[];
}
