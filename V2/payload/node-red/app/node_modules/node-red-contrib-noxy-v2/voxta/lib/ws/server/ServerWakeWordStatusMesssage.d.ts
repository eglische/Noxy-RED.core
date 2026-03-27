export interface ServerWakeWordStatusMesssage {
    $type: 'wakeWordStatus';
    sessionId: string;
    enabled: boolean;
    standBy: boolean;
}
