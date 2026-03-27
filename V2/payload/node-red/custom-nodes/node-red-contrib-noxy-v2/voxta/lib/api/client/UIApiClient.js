"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class UIApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    init(signin) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/ui/init`, {
                params: { signin },
            });
            return response.data;
        });
    }
}
exports.UIApiClient = UIApiClient;
//# sourceMappingURL=UIApiClient.js.map