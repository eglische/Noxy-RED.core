import { ImageInfo } from './ImageInfo';
import { OwnedEntity } from './OwnedEntity';
export interface ImportableObject extends OwnedEntity {
    appControlled: boolean;
    locked: boolean;
    version: string;
    name: string;
    thumbnail?: ImageInfo;
    dateCreated: string;
    dateModified: string;
}
