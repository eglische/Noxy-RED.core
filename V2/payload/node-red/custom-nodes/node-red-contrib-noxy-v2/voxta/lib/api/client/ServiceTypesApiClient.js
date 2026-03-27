"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTypesApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ServiceTypesApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    updateServiceType(serviceType, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.put(`${this.baseURL}/service-types/${serviceType}`, request);
        });
    }
}
exports.ServiceTypesApiClient = ServiceTypesApiClient;
//# sourceMappingURL=ServiceTypesApiClient.js.map