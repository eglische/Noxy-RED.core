import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientRequestSuggestionsMessage extends ClientChatSessionMessage {
    $type: 'requestSuggestions';
    count: number;
    prefix?: string;
}
