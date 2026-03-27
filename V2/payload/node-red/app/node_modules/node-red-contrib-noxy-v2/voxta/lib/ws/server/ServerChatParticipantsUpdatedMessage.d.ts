import { ChatParticipantInfo } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatParticipantsUpdatedMessage extends ServerChatSessionMessage {
    $type: 'chatParticipantsUpdated';
    characters: ChatParticipantInfo[];
}
