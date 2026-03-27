import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { MemoryBook } from '../model';
import { MemoryBooksResponse, MemoryBookItemResponse, MemoryBookSearchResponse } from '../responses';
import { UpdateMemoryItemsRequest } from '../requests';
export declare class MemoryBooksClient extends VoxtaApiClientBase {
    getMemoryBook(memoryBookId: string): Promise<MemoryBook>;
    getMemoryBooks(params: {
        packageId?: string;
        showAll?: boolean;
    }): Promise<MemoryBooksResponse>;
    createMemoryBook(params: {
        source?: string;
        packageId?: string;
        characterId?: string;
    }): Promise<MemoryBookItemResponse>;
    updateMemoryBook(memoryBookId: string, value: MemoryBook): Promise<MemoryBook>;
    deleteMemoryBook(memoryBookId: string): Promise<void>;
    unlockObject(objectId: string): Promise<void>;
    updateMemoryItems(memoryBookId: string, request: UpdateMemoryItemsRequest): Promise<MemoryBook>;
    searchMemoryBook(memoryBookId: string, query: string): Promise<MemoryBookSearchResponse>;
}
