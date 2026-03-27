"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CulturesApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class CulturesApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getCultures() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/cultures`);
            return response.data;
        });
    }
}
exports.CulturesApiClient = CulturesApiClient;
//# sourceMappingURL=CulturesApiClient.js.map