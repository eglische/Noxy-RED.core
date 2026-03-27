import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerSuggestionsMessage extends ServerChatSessionMessage {
    $type: 'suggestions';
    suggestions: string[];
}
