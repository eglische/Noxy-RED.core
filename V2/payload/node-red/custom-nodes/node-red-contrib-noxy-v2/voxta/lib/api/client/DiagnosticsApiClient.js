"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class DiagnosticsApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getDiagnostics() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/diagnostics`);
            return response.data;
        });
    }
    getDiagnosticsKey(key, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/diagnostics/keys/${key}`, {
                params: { id },
            });
            if (response.status === 404)
                return { messages: [], serviceType: 'TextGen' };
            return response.data;
        });
    }
    clearDiagnostics() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/diagnostics`);
        });
    }
}
exports.DiagnosticsApiClient = DiagnosticsApiClient;
//# sourceMappingURL=DiagnosticsApiClient.js.map