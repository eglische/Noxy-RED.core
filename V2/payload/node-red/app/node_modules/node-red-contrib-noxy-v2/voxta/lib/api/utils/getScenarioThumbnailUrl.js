"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScenarioThumbnailUrl = void 0;
const getScenarioThumbnailUrl = (scenario) => {
    if (!scenario.thumbnail)
        return undefined;
    return `/api/scenarios/${scenario.localId}/thumbnail?etag=${scenario.thumbnail.eTag}`;
};
exports.getScenarioThumbnailUrl = getScenarioThumbnailUrl;
//# sourceMappingURL=getScenarioThumbnailUrl.js.map