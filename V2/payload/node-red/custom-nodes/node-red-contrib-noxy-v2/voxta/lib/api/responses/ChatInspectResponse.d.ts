import { ChatFlowModes, ChatMessage, ChatParticipantInfo } from '../../shared';
import { FlagInfo } from '../../shared/FlagInfo';
export interface ChatInspectResponse {
    id: string;
    created: string;
    createdTimestamp: string;
    lastMemorizedMessage?: string;
    flags: FlagInfo[];
    client?: string;
    variables: Record<string, string | number | boolean>;
    characters: ChatInspectParticipant[];
    scenario?: {
        id: string;
        name: string;
        thumbnailUrl?: string;
        chatFlow: ChatFlowModes;
    };
    messages: ChatMessage[];
}
export interface ChatInspectParticipant {
    character: ChatParticipantInfo;
    role?: string;
    enabled: boolean;
}
