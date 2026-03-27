import { ChatParticipantInfo } from '../../shared';
export interface ChatResponse {
    id: string;
    created: string;
    favorite: boolean;
    title: string;
    scenarioId?: string;
    lastSession?: string;
    characters: ChatParticipantInfo[];
}
