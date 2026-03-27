import { ComputerVisionSource } from '../../shared/ComputerVisionSource';
export interface ServerVisionCaptureRequestMessage {
    $type: 'visionCaptureRequest';
    sessionId: string;
    visionCaptureRequestId: string;
    source?: ComputerVisionSource;
}
