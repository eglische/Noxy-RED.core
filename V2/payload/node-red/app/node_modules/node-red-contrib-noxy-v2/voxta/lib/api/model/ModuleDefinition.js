"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceDefinitionHosting = exports.ServiceDefinitionPricing = exports.ServiceDefinitionCategoryScore = void 0;
var ServiceDefinitionCategoryScore;
(function (ServiceDefinitionCategoryScore) {
    ServiceDefinitionCategoryScore[ServiceDefinitionCategoryScore["NotSupported"] = 0] = "NotSupported";
    ServiceDefinitionCategoryScore[ServiceDefinitionCategoryScore["Low"] = 1] = "Low";
    ServiceDefinitionCategoryScore[ServiceDefinitionCategoryScore["Medium"] = 2] = "Medium";
    ServiceDefinitionCategoryScore[ServiceDefinitionCategoryScore["High"] = 3] = "High";
})(ServiceDefinitionCategoryScore || (exports.ServiceDefinitionCategoryScore = ServiceDefinitionCategoryScore = {}));
var ServiceDefinitionPricing;
(function (ServiceDefinitionPricing) {
    ServiceDefinitionPricing[ServiceDefinitionPricing["Free"] = 0] = "Free";
    ServiceDefinitionPricing[ServiceDefinitionPricing["Low"] = 1] = "Low";
    ServiceDefinitionPricing[ServiceDefinitionPricing["Medium"] = 2] = "Medium";
    ServiceDefinitionPricing[ServiceDefinitionPricing["High"] = 3] = "High";
})(ServiceDefinitionPricing || (exports.ServiceDefinitionPricing = ServiceDefinitionPricing = {}));
var ServiceDefinitionHosting;
(function (ServiceDefinitionHosting) {
    ServiceDefinitionHosting[ServiceDefinitionHosting["Builtin"] = 0] = "Builtin";
    ServiceDefinitionHosting[ServiceDefinitionHosting["External"] = 1] = "External";
    ServiceDefinitionHosting[ServiceDefinitionHosting["Online"] = 2] = "Online";
})(ServiceDefinitionHosting || (exports.ServiceDefinitionHosting = ServiceDefinitionHosting = {}));
//# sourceMappingURL=ModuleDefinition.js.map