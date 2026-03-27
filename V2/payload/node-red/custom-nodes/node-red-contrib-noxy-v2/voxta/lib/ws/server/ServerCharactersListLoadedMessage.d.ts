export type ServerCharactersListLoadedMessage = {
    $type: 'charactersListLoaded';
    characters: CharactersListItem[];
};
type CharactersListItem = {
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
    favorite: boolean;
    scenarioOnly: boolean;
};
export {};
