import { MemoryItem } from '../model';
export interface MemoryMergeResponse {
    removed: MemoryItem[];
    updated: MemoryMergeUpdate[];
}
export interface MemoryMergeUpdate {
    item: MemoryItem;
    text: string;
    keywords: string[];
}
