"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharactersApiClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const VoxtaApiClientBase_1 = require("./VoxtaApiClientBase");
class CharactersApiClient extends VoxtaApiClientBase_1.VoxtaApiClientBase {
    getCharacters(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/characters/`, {
                params,
            });
            return response.data.characters;
        });
    }
    createCharacter(init) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/characters`, init);
            return response.data;
        });
    }
    getCharacter(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/characters/${characterId}`);
            return response.data;
        });
    }
    getCharacterAssets(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/characters/${characterId}/assets`);
            return response.data;
        });
    }
    getCharacterOverview(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/characters/${characterId}/overview`);
            return response.data;
        });
    }
    updateCharacter(characterId, character) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.put(`${this.baseURL}/characters/${characterId}`, character);
        });
    }
    updateCharacterThumbnail(characterId, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('file', file);
            const response = yield axios_1.default.put(`${this.baseURL}/characters/${characterId}/thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        });
    }
    deleteCharacterThumbnail(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/characters/${characterId}/thumbnail`);
        });
    }
    deleteCharacter(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/characters/${characterId}`);
        });
    }
    getCharacterTags() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/characters/tags`);
            return response.data;
        });
    }
    unlockObject(objectId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${this.baseURL}/characters/${objectId}/lock`);
        });
    }
    getCharacterPrivateMemoryBook(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/characters/${characterId}/memory-book`, {
                validateStatus: (status) => status === 200 || status === 404,
            });
            if (response.status === 404)
                return null;
            return response.data;
        });
    }
    validateCharacter(value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/characters/validate`, value);
            return response.data;
        });
    }
}
exports.CharactersApiClient = CharactersApiClient;
//# sourceMappingURL=CharactersApiClient.js.map