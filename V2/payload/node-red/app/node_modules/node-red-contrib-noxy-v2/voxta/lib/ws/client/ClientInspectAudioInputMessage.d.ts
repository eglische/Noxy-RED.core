export interface ClientInspectAudioInputMessage {
    $type: 'inspectAudioInput';
    audioFrames: boolean;
    culture?: string;
    speechToText: boolean;
}
