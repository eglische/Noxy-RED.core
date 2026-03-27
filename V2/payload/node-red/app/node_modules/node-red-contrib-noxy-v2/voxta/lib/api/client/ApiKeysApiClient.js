"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ApiKeysApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getApiKeys() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/api-keys/`);
            return response.data;
        });
    }
    createApiKey(name, scopes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/api-keys`, {
                name,
                scopes,
            });
            return response.data;
        });
    }
    deleteApiKey(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/api-keys/${id}`);
        });
    }
}
exports.ApiKeysApiClient = ApiKeysApiClient;
//# sourceMappingURL=ApiKeysApiClient.js.map