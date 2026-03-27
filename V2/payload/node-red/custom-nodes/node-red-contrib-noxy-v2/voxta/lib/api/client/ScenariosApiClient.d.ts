import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { Scenario, ValidationResults } from '../model';
import { ScenariosResponse, ScenarioItemResponse, ImageInfoResponse, AssetsResponse } from '../responses';
export declare class ScenariosApiClient extends VoxtaApiClientBase {
    getScenario(scenarioId: string): Promise<Scenario>;
    getScenarioAssets(scenarioId: string): Promise<AssetsResponse>;
    getScenarios(params: {
        includeChatsInfo?: boolean;
        packageId?: string;
    }): Promise<ScenariosResponse>;
    createScenario(params: {
        source?: string;
        name?: string;
        parentId?: string;
        packageId?: string;
        characterId?: string;
    }): Promise<ScenarioItemResponse>;
    updateScenario(scenarioId: string, value: Scenario): Promise<Scenario>;
    updateScenarioThumbnail(scenarioId: string, file: File): Promise<ImageInfoResponse>;
    deleteScenarioThumbnail(scenarioId: string): Promise<void>;
    deleteScenario(scenarioId: string): Promise<void>;
    validateScenario(value: Scenario): Promise<ValidationResults>;
    unlockObject(objectId: string): Promise<void>;
    patchScenario(scenarioId: string, params: Partial<ScenarioItemResponse>): Promise<void>;
}
