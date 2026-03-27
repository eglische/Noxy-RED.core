"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoicesApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class VoicesApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getVoices(serviceId, characterId, culture) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/voices/services/${serviceId}`, {
                params: { culture, characterId },
            });
            return response.data;
        });
    }
    getSpeechUrl(serviceId, characterId, culture, parameters, text) {
        const url = new URL(`${this.baseURL}/tts/speak`, window.location.origin);
        url.searchParams.append('serviceId', serviceId);
        if (characterId) {
            url.searchParams.append('characterId', characterId);
        }
        url.searchParams.append('culture', culture);
        url.searchParams.append('parameters', JSON.stringify(parameters));
        url.searchParams.append('text', text);
        return url.toString();
    }
}
exports.VoicesApiClient = VoicesApiClient;
//# sourceMappingURL=VoicesApiClient.js.map