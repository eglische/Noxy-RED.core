import { ChatFlowStates } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatFlowMessage extends ServerChatSessionMessage {
    $type: 'chatFlow';
    state: ChatFlowStates;
}
