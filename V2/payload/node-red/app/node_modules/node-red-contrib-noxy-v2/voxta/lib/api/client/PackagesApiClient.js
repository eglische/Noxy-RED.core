"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagesApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class PackagesApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getPackages() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/packages/`);
            return response.data;
        });
    }
    getPackage(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/packages/${id}`);
            return response.data;
        });
    }
    getPackageInfo(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/packages/${id}/overview`);
            return response.data;
        });
    }
    updatePackage(packageId, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.put(`${this.baseURL}/packages/${packageId}`, value);
            return response.data;
        });
    }
    deletePackage(packageId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/packages/${packageId}`);
        });
    }
    createPackage() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/packages`);
            return response.data;
        });
    }
    unlockObject(objectId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/packages/${objectId}/lock`);
        });
    }
}
exports.PackagesApiClient = PackagesApiClient;
//# sourceMappingURL=PackagesApiClient.js.map