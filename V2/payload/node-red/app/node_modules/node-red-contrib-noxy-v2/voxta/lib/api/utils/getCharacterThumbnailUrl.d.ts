import { ImageInfo } from '../model';
export declare const getCharacterThumbnailUrl: (character: {
    localId: string;
    thumbnail?: ImageInfo;
}) => string | undefined;
