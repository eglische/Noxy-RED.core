"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenariosApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ScenariosApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getScenario(scenarioId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/scenarios/${scenarioId}`);
            return response.data;
        });
    }
    getScenarioAssets(scenarioId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/scenarios/${scenarioId}/assets`);
            return response.data;
        });
    }
    getScenarios(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/scenarios/`, { params });
            return response.data;
        });
    }
    createScenario(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/scenarios`, null, {
                params,
            });
            return response.data;
        });
    }
    updateScenario(scenarioId, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.put(`${this.baseURL}/scenarios/${scenarioId}`, value);
            return response.data;
        });
    }
    updateScenarioThumbnail(scenarioId, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('file', file);
            const response = yield axios_1.default.put(`${this.baseURL}/scenarios/${scenarioId}/thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        });
    }
    deleteScenarioThumbnail(scenarioId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/scenarios/${scenarioId}/thumbnail`);
        });
    }
    deleteScenario(scenarioId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/scenarios/${scenarioId}`);
        });
    }
    validateScenario(value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/scenarios/validate`, value);
            return response.data;
        });
    }
    unlockObject(objectId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/scenarios/${objectId}/lock`);
        });
    }
    patchScenario(scenarioId, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.patch(`${this.baseURL}/scenarios/${scenarioId}`, params);
        });
    }
}
exports.ScenariosApiClient = ScenariosApiClient;
//# sourceMappingURL=ScenariosApiClient.js.map