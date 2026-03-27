"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ProfilesApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getProfile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/profile`);
            return response.data;
        });
    }
    createProfile(settings) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/profile`, settings);
            return response.data;
        });
    }
    updateProfile(settings) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.put(`${this.baseURL}/profile`, settings);
            return response.data;
        });
    }
    updateProfileThumbnail(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('file', file);
            const response = yield axios_1.default.put(`${this.baseURL}/profile/thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        });
    }
    deleteProfileThumbnail() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/profile/thumbnail`);
        });
    }
}
exports.ProfilesApiClient = ProfilesApiClient;
//# sourceMappingURL=ProfilesApiClient.js.map