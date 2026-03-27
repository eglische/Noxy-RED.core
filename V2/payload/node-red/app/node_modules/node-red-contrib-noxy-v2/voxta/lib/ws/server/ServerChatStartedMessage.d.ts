import { ChatMessage } from '../../shared';
import { ServerChatConfigurationMessageBase } from './ServerChatConfigurationMessage';
import { ServerContextUpdatedMessage } from './ServerContextUpdatedMessage';
export interface ServerChatStartedMessage extends ServerChatConfigurationMessageBase {
    $type: 'chatStarted';
    messages: ChatMessage[];
    context: ServerContextUpdatedMessage;
}
