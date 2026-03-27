"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoxtaApiClient = void 0;
const ServiceDefinitionsApiClient_1 = require("./client/ServiceDefinitionsApiClient");
const ModulesApiClient_1 = require("./client/ModulesApiClient");
const PresetsApiClient_1 = require("./client/PresetsApiClient");
const ChatsApiClient_1 = require("./client/ChatsApiClient");
const CharactersApiClient_1 = require("./client/CharactersApiClient");
const ServiceTypesApiClient_1 = require("./client/ServiceTypesApiClient");
const MemoryBooksApiClient_1 = require("./client/MemoryBooksApiClient");
const ScenariosApiClient_1 = require("./client/ScenariosApiClient");
const VoicesApiClient_1 = require("./client/VoicesApiClient");
const CulturesApiClient_1 = require("./client/CulturesApiClient");
const DiagnosticsApiClient_1 = require("./client/DiagnosticsApiClient");
const TextGenApiClient_1 = require("./client/TextGenApiClient");
const VisionApiClient_1 = require("./client/VisionApiClient");
const BenchmarksApiClient_1 = require("./client/BenchmarksApiClient");
const ProfilesApiClient_1 = require("./client/ProfilesApiClient");
const ImportApiClient_1 = require("./client/ImportApiClient");
const AppsApiClient_1 = require("./client/AppsApiClient");
const AugmentationsApiClient_1 = require("./client/AugmentationsApiClient");
const PackagesApiClient_1 = require("./client/PackagesApiClient");
const SummarizationApiClient_1 = require("./client/SummarizationApiClient");
const AuthApiClient_1 = require("./client/AuthApiClient");
const UsersApiClient_1 = require("./client/UsersApiClient");
const ApiKeysApiClient_1 = require("./client/ApiKeysApiClient");
const DeviceApiClient_1 = require("./client/DeviceApiClient");
const UIApiClient_1 = require("./client/UIApiClient");
class VoxtaApiClient {
    constructor() {
        this.auth = new AuthApiClient_1.AuthApiClient();
        this.serviceDefinitions = new ServiceDefinitionsApiClient_1.ServiceDefinitionsApiClient();
        this.modules = new ModulesApiClient_1.ModulesApiClient();
        this.presets = new PresetsApiClient_1.PresetsApiClient();
        this.chats = new ChatsApiClient_1.ChatsApiClient();
        this.characters = new CharactersApiClient_1.CharactersApiClient();
        this.serviceTypes = new ServiceTypesApiClient_1.ServiceTypesApiClient();
        this.memoryBooks = new MemoryBooksApiClient_1.MemoryBooksClient();
        this.scenarios = new ScenariosApiClient_1.ScenariosApiClient();
        this.voices = new VoicesApiClient_1.VoicesApiClient();
        this.cultures = new CulturesApiClient_1.CulturesApiClient();
        this.diagnostics = new DiagnosticsApiClient_1.DiagnosticsApiClient();
        this.textGen = new TextGenApiClient_1.TextGenApiClient();
        this.vision = new VisionApiClient_1.VisionApiClient();
        this.benchmarks = new BenchmarksApiClient_1.BenchmarksApiClient();
        this.profiles = new ProfilesApiClient_1.ProfilesApiClient();
        this.import = new ImportApiClient_1.ImportApiClient();
        this.apps = new AppsApiClient_1.AppsApiClient();
        this.augmentations = new AugmentationsApiClient_1.AugmentationsApiClient();
        this.packages = new PackagesApiClient_1.PackagesApiClient();
        this.summarization = new SummarizationApiClient_1.SummarizationApiClient();
        this.users = new UsersApiClient_1.UsersApiClient();
        this.apiKeys = new ApiKeysApiClient_1.ApiKeysApiClient();
        this.device = new DeviceApiClient_1.DeviceApiClient();
        this.ui = new UIApiClient_1.UIApiClient();
    }
}
exports.VoxtaApiClient = VoxtaApiClient;
//# sourceMappingURL=VoxtaApiClient.js.map