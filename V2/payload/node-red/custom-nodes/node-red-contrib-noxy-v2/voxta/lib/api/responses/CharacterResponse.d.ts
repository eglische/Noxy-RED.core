import { ChatStyles } from '../../shared';
export interface CharacterResponse {
    id: string;
    name: string;
    appControlled: boolean;
    dateCreated?: string;
    dateCreatedAgo?: string;
    dateModified?: string;
    dateModifiedAgo?: string;
    creator?: string;
    creatorNotes?: string;
    culture: string;
    tags?: string[];
    thumbnailUrl?: string;
    explicitContent: boolean;
    importedFrom?: string;
    packageId?: string;
    favorite: boolean;
    scenarioOnly: boolean;
    chatStyle: ChatStyles;
    lastChatTimestamp?: string;
    lastChat?: string;
    chatsCount: number;
}
