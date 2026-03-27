"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class DeviceApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    verify(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/device/verify`, request);
            return response.data;
        });
    }
}
exports.DeviceApiClient = DeviceApiClient;
//# sourceMappingURL=DeviceApiClient.js.map