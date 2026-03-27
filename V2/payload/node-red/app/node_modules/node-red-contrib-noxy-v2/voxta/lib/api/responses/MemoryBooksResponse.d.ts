import { PackageItemResponse } from './ScenariosResponse';
export interface MemoryBooksResponse {
    memoryBooks: MemoryBookItemResponse[];
}
export interface MemoryBookItemResponse {
    id: string;
    name: string;
    thumbnailUrl?: string;
    description: string;
    creator: string;
    package?: PackageItemResponse;
    explicitContent: boolean;
    dateCreated?: string;
    dateCreatedAgo?: string;
    dateUpdated?: string;
    dateUpdatedAgo?: string;
}
