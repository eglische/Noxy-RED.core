"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryBooksClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class MemoryBooksClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getMemoryBook(memoryBookId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/memory-books/${memoryBookId}`);
            return response.data;
        });
    }
    getMemoryBooks(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/memory-books/`, {
                params,
            });
            return response.data;
        });
    }
    createMemoryBook(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/memory-books`, null, {
                params,
            });
            return response.data;
        });
    }
    updateMemoryBook(memoryBookId, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.put(`${this.baseURL}/memory-books/${memoryBookId}`, value);
            return response.data;
        });
    }
    deleteMemoryBook(memoryBookId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/memory-books/${memoryBookId}`);
        });
    }
    unlockObject(objectId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/memory-books/${objectId}/lock`);
        });
    }
    updateMemoryItems(memoryBookId, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/memory-books/${memoryBookId}/items`, request);
            return response.data;
        });
    }
    searchMemoryBook(memoryBookId, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/memory-books/${memoryBookId}/search`, { params: { query } });
            return response.data;
        });
    }
}
exports.MemoryBooksClient = MemoryBooksClient;
//# sourceMappingURL=MemoryBooksApiClient.js.map