"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceDefinitionsApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ServiceDefinitionsApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getServiceDefinitions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/modules-definitions`);
            return response.data;
        });
    }
}
exports.ServiceDefinitionsApiClient = ServiceDefinitionsApiClient;
//# sourceMappingURL=ServiceDefinitionsApiClient.js.map