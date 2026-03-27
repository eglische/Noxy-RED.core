"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class ChatsApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getChats(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/chats`, {
                params: { characterId: characterId },
            });
            return response.data.chats;
        });
    }
    getChatInspect(chatId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/chats/${chatId}/inspect`);
            return response.data;
        });
    }
    getChatSummary(chatId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/chats/${chatId}/summary`);
            return response.data;
        });
    }
    createChat(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/chats`, {
                characters: params.characters,
                roles: params.roles ? params.roles : undefined,
                scenario: params.scenario ? params.scenario : undefined,
                client: params.client,
                ephemeral: params.ephemeral,
            });
            return response.data;
        });
    }
    deleteChat(chatId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/chats/${chatId}`);
        });
    }
    deleteMessage(chatId, messageId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/chats/${chatId}/messages/${messageId}`);
        });
    }
    cloneChat(chatId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/chats/${chatId}/clone`);
            return response.data;
        });
    }
    patchChat(chatId, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.patch(`${this.baseURL}/chats/${chatId}`, params);
        });
    }
}
exports.ChatsApiClient = ChatsApiClient;
//# sourceMappingURL=ChatsApiClient.js.map