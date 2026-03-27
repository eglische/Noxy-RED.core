"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class AuthApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    signin(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/auth/signin`, request);
            return response.data;
        });
    }
    signout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/auth/signout`, {});
            return response.data;
        });
    }
    change(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/auth/change`, request);
            return response.data;
        });
    }
    nonce() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/auth/nonce`);
            return response.data;
        });
    }
    test() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/auth/test`);
            return response.data;
        });
    }
}
exports.AuthApiClient = AuthApiClient;
//# sourceMappingURL=AuthApiClient.js.map