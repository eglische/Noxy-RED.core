import { ComputerVisionSource } from '../../shared';
export interface ClientAuthenticateMessage {
    $type: 'authenticate';
    client: string;
    clientVersion?: string;
    scope?: string[];
    capabilities: {
        audioOutput: 'None' | 'Url' | 'LocalFile' | 'Disabled';
        audioOutputLocalFileFolder?: string;
        acceptedAudioContentTypes?: string[];
        audioInput: 'None' | 'WebSocketStream' | 'Disabled';
        visionCapture: 'None' | 'PostImage' | 'Disabled';
        visionSources?: ComputerVisionSource[];
    };
}
