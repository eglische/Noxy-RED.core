import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatSessionErrorMessage extends ServerChatSessionMessage {
    $type: 'chatSessionError';
    message: string;
    code?: string;
    serviceName?: string;
    details?: string;
    retry: boolean;
}
