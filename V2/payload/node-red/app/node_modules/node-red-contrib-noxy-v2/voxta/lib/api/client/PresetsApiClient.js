"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetsApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class PresetsApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getPresets(moduleId, serviceType) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/modules/${moduleId}/presets/${serviceType}`);
            return response.data.presets;
        });
    }
    getPreset(presetId, serviceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/presets/${presetId}`, {
                params: { serviceId },
            });
            return response.data;
        });
    }
    createPreset(serviceName, serviceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/presets/`, {
                serviceName: serviceName,
            }, { params: { serviceId } });
            return response.data.value;
        });
    }
    updatePreset(presetId, moduleId, updateRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.put(`${this.baseURL}/presets/${presetId}`, updateRequest, { params: { moduleId } });
            return response.data;
        });
    }
    deletePreset(presetId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/presets/${presetId}`);
        });
    }
    clonePreset(presetId, serviceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/presets/${presetId}/clones`, undefined, { params: { serviceId } });
            return response.data.value;
        });
    }
}
exports.PresetsApiClient = PresetsApiClient;
//# sourceMappingURL=PresetsApiClient.js.map