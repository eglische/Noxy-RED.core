import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientRemoveChatParticipantMessage extends ClientChatSessionMessage {
    $type: 'removeChatParticipant';
    characterId: string;
}
