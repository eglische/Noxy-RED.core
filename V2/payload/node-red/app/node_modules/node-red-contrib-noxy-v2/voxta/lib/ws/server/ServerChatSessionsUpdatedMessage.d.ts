import { ChatSessionInfo } from '../../shared/ChatSessionInfo';
export type ServerChatSessionsUpdatedMessage = {
    $type: 'chatsSessionsUpdated';
    sessions: ChatSessionInfo[];
};
