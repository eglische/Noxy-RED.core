import { ChatResourceStatusInformation } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerMissingResourcesErrorMessage extends ServerChatSessionMessage {
    $type: 'missingResourcesError';
    resources: ChatResourceStatusInformation[];
}
