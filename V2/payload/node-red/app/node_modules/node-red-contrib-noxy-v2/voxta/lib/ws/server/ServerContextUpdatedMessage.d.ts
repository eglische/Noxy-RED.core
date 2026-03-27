import { ChatParticipantInfo, FunctionTiming } from '../../shared';
import { FlagInfo } from '../../shared/FlagInfo';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export type FunctionKeyEntry = {
    contextKey: string;
    name: string;
    layer?: string;
    description: string;
    flagsFilter?: string;
    roleFilter?: string;
    timing?: FunctionTiming;
};
export interface ServerContextUpdatedMessage extends ServerChatSessionMessage {
    $type: 'contextUpdated';
    flags: FlagInfo[];
    characters: ChatParticipantInfo[];
    roles: {
        [role: string]: {
            characterId?: string;
            enabled: boolean;
        };
    };
    contexts: {
        contextKey: string;
        text: string;
        flagsFilter?: string;
    }[];
    actions: FunctionKeyEntry[];
    buttons: FunctionKeyEntry[];
}
