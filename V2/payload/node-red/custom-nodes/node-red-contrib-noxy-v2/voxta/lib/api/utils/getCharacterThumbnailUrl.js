"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharacterThumbnailUrl = void 0;
const getCharacterThumbnailUrl = (character) => {
    if (!character.thumbnail)
        return undefined;
    return `/api/characters/${character.localId}/thumbnail?etag=${character.thumbnail.eTag}`;
};
exports.getCharacterThumbnailUrl = getCharacterThumbnailUrl;
//# sourceMappingURL=getCharacterThumbnailUrl.js.map