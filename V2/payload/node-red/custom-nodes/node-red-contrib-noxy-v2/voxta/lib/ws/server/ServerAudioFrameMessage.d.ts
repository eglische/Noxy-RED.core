export type ServerAudioFrameMessage = {
    $type: 'audioFrame';
    rms: number;
    voiceActivity: boolean;
};
