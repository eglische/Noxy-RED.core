"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchmarksApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
const fetch_event_source_1 = require("@microsoft/fetch-event-source");
class BenchmarksApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getBenchmarks() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/benchmarks`);
            return response.data;
        });
    }
    runBenchmark(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/benchmarks`, request);
            return response.data;
        });
    }
    cancelBenchmark() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/benchmarks`);
            return response.data;
        });
    }
    getBenchmarkStream(callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield (0, fetch_event_source_1.fetchEventSource)(`${this.baseURL}/benchmarks/stream`, {
                method: 'GET',
                onopen(response) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (response.ok) {
                            if (response.headers.get('content-type') !== fetch_event_source_1.EventStreamContentType)
                                throw new Error('Unexpected content type: ' + response.headers.get('content-type'));
                            return; // everything's good
                        }
                        else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                            // client-side errors are usually non-retriable:
                            throw new Error('Server failure: ' + response.status);
                        }
                        else {
                            throw new Error('Unexpected status: ' + response.status);
                        }
                    });
                },
                onmessage(ev) {
                    if (!ev.data || ev.data == '\0' || ev.data.startsWith(':'))
                        return;
                    try {
                        callback(JSON.parse(ev.data));
                    }
                    catch (e) {
                        console.error('Failed to parse JSON. Error:', e, 'Data:', ev.data);
                    }
                },
                onerror(err) {
                    throw err;
                },
            });
        });
    }
}
exports.BenchmarksApiClient = BenchmarksApiClient;
//# sourceMappingURL=BenchmarksApiClient.js.map