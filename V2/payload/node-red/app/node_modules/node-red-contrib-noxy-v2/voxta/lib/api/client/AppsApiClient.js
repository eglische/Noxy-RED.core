"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class AppsApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getApps() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/apps/`);
            return response.data;
        });
    }
    getApp(clientId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/apps/${clientId}`);
            return response.data;
        });
    }
    deleteApp(clientId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/apps/${clientId}`);
        });
    }
}
exports.AppsApiClient = AppsApiClient;
//# sourceMappingURL=AppsApiClient.js.map