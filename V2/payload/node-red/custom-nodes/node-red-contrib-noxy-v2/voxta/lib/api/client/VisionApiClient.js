"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class VisionApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    captureImage(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/vision/capture`, {
                params: { source },
            });
            return response.data;
        });
    }
    describeImage(base64Url, source, personality, previousVision, message, label) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/vision/describe`, {
                base64Url,
                source,
                personality,
                previousVision,
                message,
                label,
            });
            return response.data;
        });
    }
    sendImage(sessionId, visionCaptureRequestId, source, file, label) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('file', file);
            const response = yield axios_1.default.post(`${this.baseURL}/vision/requests/${visionCaptureRequestId}/send`, formData, {
                params: { sessionId, source, label },
            });
            return response.data;
        });
    }
    delay(sessionId, visionCaptureRequestId, milliseconds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/vision/requests/${visionCaptureRequestId}/delay`, {}, {
                params: { sessionId, milliseconds },
            });
            return response.data;
        });
    }
    cancel(sessionId, visionCaptureRequestId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/vision/requests/${visionCaptureRequestId}`, {
                params: { sessionId },
            });
            return response.data;
        });
    }
}
exports.VisionApiClient = VisionApiClient;
//# sourceMappingURL=VisionApiClient.js.map