import { AssetsResponse, CharacterResponse, ImageInfoResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { Character, MemoryBook, ValidationResults } from '../model';
import { CreateCharacterRequest } from '../requests';
export declare class CharactersApiClient extends VoxtaApiClientBase {
    getCharacters(params: {
        assistant?: boolean;
        includeChatsInfo?: boolean;
        favoritesOnly?: boolean;
        packageId?: string;
        max?: number;
    }): Promise<CharacterResponse[]>;
    createCharacter(init: CreateCharacterRequest): Promise<Character>;
    getCharacter(characterId: string): Promise<Character>;
    getCharacterAssets(characterId: string): Promise<AssetsResponse>;
    getCharacterOverview(characterId: string): Promise<CharacterResponse>;
    updateCharacter(characterId: string, character: Partial<Omit<Character, 'id'>>): Promise<void>;
    updateCharacterThumbnail(characterId: string, file: File): Promise<ImageInfoResponse>;
    deleteCharacterThumbnail(characterId: string): Promise<void>;
    deleteCharacter(characterId: string): Promise<void>;
    getCharacterTags(): Promise<string[]>;
    unlockObject(objectId: string): Promise<void>;
    getCharacterPrivateMemoryBook(characterId: string): Promise<MemoryBook | null>;
    validateCharacter(value: Character): Promise<ValidationResults>;
}
