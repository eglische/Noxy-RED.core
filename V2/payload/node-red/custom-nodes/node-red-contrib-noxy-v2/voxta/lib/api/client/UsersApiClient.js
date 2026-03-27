"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class UsersApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getUsers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/users/`);
            return response.data;
        });
    }
    getUser(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/users/${id}`);
            return response.data;
        });
    }
    createUser(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/users`, {
                username,
                password,
            });
            return response.data;
        });
    }
    deleteUser(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/users/${id}`);
        });
    }
    patchUser(id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.patch(`${this.baseURL}/users/${id}`, data);
            return response.data;
        });
    }
}
exports.UsersApiClient = UsersApiClient;
//# sourceMappingURL=UsersApiClient.js.map