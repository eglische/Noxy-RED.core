import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientAddChatParticipantMessage extends ClientChatSessionMessage {
    $type: 'addChatParticipant';
    characterId: string;
    role?: string;
}
