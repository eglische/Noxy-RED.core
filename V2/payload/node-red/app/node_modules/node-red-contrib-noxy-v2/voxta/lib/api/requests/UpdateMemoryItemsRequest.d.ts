import { MemoryItem } from '../model';
export interface UpdateMemoryItemsRequest {
    add?: MemoryItem[];
    update?: MemoryItem[];
    remove?: string[];
}
