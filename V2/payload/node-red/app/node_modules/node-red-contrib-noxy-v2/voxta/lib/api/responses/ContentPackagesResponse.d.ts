import { ChatResourceReference } from '../../shared';
export interface ContentPackagesResponse {
    packages: ContentPackageItemResponse[];
}
export interface ContentPackageItemResponse {
    id: string;
    name: string;
    thumbnailUrl?: string;
    entryResource?: ChatResourceReference;
    appControlled: boolean;
    version: string;
    explicitContent: boolean;
    description: string;
    creator: string;
    dateCreated: string;
    dateCreatedAgo: string;
    dateModified: string;
    dateModifiedAgo: string;
}
