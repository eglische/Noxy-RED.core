import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ComputerVisionSource } from '../../shared';
import { CaptureImageResponse } from '../responses';
export declare class VisionApiClient extends VoxtaApiClientBase {
    captureImage(source: ComputerVisionSource): Promise<CaptureImageResponse>;
    describeImage(base64Url: string, source: ComputerVisionSource, personality?: string, previousVision?: string, message?: string, label?: string): Promise<{
        description: string;
    }>;
    sendImage(sessionId: string, visionCaptureRequestId: string, source: ComputerVisionSource, file: File, label: string | undefined): Promise<void>;
    delay(sessionId: string, visionCaptureRequestId: string, milliseconds: number): Promise<void>;
    cancel(sessionId: string, visionCaptureRequestId: string): Promise<void>;
}
