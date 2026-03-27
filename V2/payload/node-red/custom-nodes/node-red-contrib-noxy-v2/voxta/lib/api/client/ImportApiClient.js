"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ImportApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    importObject(file, overwrite) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('file', file);
            const response = yield axios_1.default.post(`${this.baseURL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: {
                    overwrite,
                },
            });
            return response.data;
        });
    }
}
exports.ImportApiClient = ImportApiClient;
//# sourceMappingURL=ImportApiClient.js.map