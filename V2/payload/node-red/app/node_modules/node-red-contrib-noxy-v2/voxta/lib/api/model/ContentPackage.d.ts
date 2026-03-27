import { ChatResourceReference } from '../../shared';
import { ImportableObject } from './ImportableObject';
export interface ContentPackage extends ImportableObject {
    explicitContent: boolean;
    description: string;
    creator: string;
    thumbnailResource?: ChatResourceReference;
    entryResource?: ChatResourceReference;
}
