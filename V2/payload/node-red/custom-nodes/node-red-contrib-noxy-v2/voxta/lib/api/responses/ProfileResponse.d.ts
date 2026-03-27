export interface ProfileResponse {
    name: string;
    description?: string;
    thumbnailUrl?: string;
    pauseSpeechRecognitionDuringPlayback: boolean;
    hideExplicitContent: boolean;
    assistantCharacterId?: string;
}
