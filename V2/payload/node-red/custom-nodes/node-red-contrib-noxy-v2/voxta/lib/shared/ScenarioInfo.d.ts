import { ChatFlowModes } from './ChatFlowModes';
import { ChatStyles } from './ChatStyles';
export interface ScenarioInfo {
    id: string;
    name: string;
    chatFlow: ChatFlowModes;
    chatStyle: ChatStyles;
    roles: ScenarioInfoRole[];
    thumbnailUrl?: string;
    packageId?: string;
    client: string;
}
export interface ScenarioInfoRole {
    name: string;
    description?: string;
}
