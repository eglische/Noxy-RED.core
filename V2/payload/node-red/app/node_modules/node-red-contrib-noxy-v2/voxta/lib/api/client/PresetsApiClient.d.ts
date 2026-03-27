import { PresetItemResponse, PresetResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ServiceTypes } from '../../shared';
import { UpdatePresetRequest } from '../requests';
export declare class PresetsApiClient extends VoxtaApiClientBase {
    getPresets(moduleId: string, serviceType: ServiceTypes): Promise<PresetItemResponse[]>;
    getPreset(presetId: string, serviceId?: string): Promise<PresetResponse>;
    createPreset(serviceName: string, serviceId?: string): Promise<PresetResponse>;
    updatePreset(presetId: string, moduleId: string | undefined, updateRequest: UpdatePresetRequest): Promise<PresetResponse>;
    deletePreset(presetId: string): Promise<void>;
    clonePreset(presetId: string, serviceId?: string): Promise<PresetResponse>;
}
