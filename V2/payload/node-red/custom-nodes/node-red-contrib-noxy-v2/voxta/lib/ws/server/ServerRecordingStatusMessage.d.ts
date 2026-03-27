export interface ServerRecordingStatusMessage {
    $type: 'recordingStatus';
    sessionId: string;
    enabled: boolean;
}
