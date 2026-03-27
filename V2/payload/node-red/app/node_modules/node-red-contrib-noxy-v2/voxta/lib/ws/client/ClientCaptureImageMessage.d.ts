import { ComputerVisionSource } from '../../shared';
import { ClientChatSessionMessage } from './ClientChatSessionMessage';
export interface ClientCaptureImageMessage extends ClientChatSessionMessage {
    $type: 'captureImage';
    source?: ComputerVisionSource;
    label?: string;
}
