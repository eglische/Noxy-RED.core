"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizationApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class SummarizationApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    extract(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/summarization/extract`, request);
            return response.data;
        });
    }
    merge(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/summarization/merge`, request);
            return response.data;
        });
    }
}
exports.SummarizationApiClient = SummarizationApiClient;
//# sourceMappingURL=SummarizationApiClient.js.map