import { DiagnosticResultResponse, ModuleResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ServiceTypes } from '../../shared';
import { UpdateModuleRequest } from '../requests';
export declare class ModulesApiClient extends VoxtaApiClientBase {
    getModule(moduleId: string): Promise<ModuleResponse>;
    createModule(serviceName: string): Promise<ModuleResponse>;
    installModule(moduleId: string): Promise<void>;
    installAllModules(): Promise<void>;
    getInstallModuleStream(moduleId: string, callback: (message: {
        text: string;
        level: 'ERROR' | 'SUCCESS' | 'INFO';
    }) => void): Promise<void>;
    testModule(moduleId: string): Promise<DiagnosticResultResponse>;
    updateModule(moduleId: string, updateRequest: UpdateModuleRequest): Promise<ModuleResponse>;
    deleteModule(moduleId: string): Promise<void>;
    changeServicePreset(moduleId: string, moduleType: ServiceTypes, presetId: string): Promise<void>;
}
