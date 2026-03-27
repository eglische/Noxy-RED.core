import { ClientChatSessionMessage } from './ClientChatSessionMessage';
import { ContextDefinition } from '../../shared/ContextDefinition';
import { ScenarioAction } from '../../api';
export interface ClientUpdateContextMessage extends ClientChatSessionMessage {
    $type: 'updateContext';
    setFlags?: string[];
    enableRoles?: {
        [role: string]: boolean;
    };
    contextKey?: string;
    contexts?: ContextDefinition[];
    actions?: ScenarioAction[];
}
