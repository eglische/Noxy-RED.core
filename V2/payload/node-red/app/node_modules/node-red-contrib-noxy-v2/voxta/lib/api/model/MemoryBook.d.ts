import { ChatResourceReference } from '../../shared';
import { ImportableObject } from './ImportableObject';
export interface MemoryBook extends ImportableObject {
    packageId?: string;
    creator?: string;
    description: string;
    items: MemoryItem[];
    explicitContent: boolean;
    owner?: ChatResourceReference;
}
export interface MemoryItem {
    id: string;
    keywords: string[];
    weight: number;
    text: string;
    sourceChatId?: string;
    createdAt?: string;
    deletedAt?: string;
    lastUpdated?: string;
    deleted?: boolean;
}
