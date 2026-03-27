import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientRunScriptMessage extends ClientChatSessionMessage {
    $type: 'runScript';
    script: string;
}
