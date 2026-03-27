import { ComputerVisionSource } from '../../shared';
export interface CaptureImageResponse {
    base64Url: string;
    source: ComputerVisionSource;
    label?: string;
}
