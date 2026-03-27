export interface ServerRecordingRequestMessage {
    $type: 'recordingStatus';
    sessionId: string;
    enabled: boolean;
}
