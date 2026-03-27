import { MemoryItem } from '../model';
export interface MemoryBookSearchResponse {
    items: MemoryBookSearchResult[];
}
export interface MemoryBookSearchResult {
    memory: MemoryItem;
    distance: number;
}
