"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AugmentationsApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class AugmentationsApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getAugmentations() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/augmentations/`);
            return response.data;
        });
    }
}
exports.AugmentationsApiClient = AugmentationsApiClient;
//# sourceMappingURL=AugmentationsApiClient.js.map