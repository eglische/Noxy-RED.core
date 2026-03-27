"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUndefinedServicesListItemInfo = createUndefinedServicesListItemInfo;
const api_1 = require("../../api");
function createUndefinedServicesListItemInfo(defaultServiceId) {
    return {
        enabled: false,
        id: defaultServiceId,
        name: '',
        serviceLabel: defaultServiceId,
        presets: [],
        activePreset: undefined,
        pricing: api_1.ServiceDefinitionPricing.Free,
        required: false,
        single: false,
        score: 0,
        augmentations: [],
    };
}
//# sourceMappingURL=ServerConfigurationMessage.js.map