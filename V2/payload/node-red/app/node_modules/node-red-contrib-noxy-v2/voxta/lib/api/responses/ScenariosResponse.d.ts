import { ChatFlowModes, ChatStyles } from '../../shared';
import { ImportableObjectResponse } from './ImportableObjectResponse';
export interface ScenariosResponse {
    scenarios: ScenarioItemResponse[];
}
export interface ScenarioItemResponse extends ImportableObjectResponse {
    client?: string;
    package?: PackageItemResponse;
    description: string;
    creator: string;
    explicitContent: boolean;
    dateCreated?: string;
    dateCreatedAgo?: string;
    dateModified?: string;
    dateModifiedAgo?: string;
    parentId?: string;
    favorite: boolean;
    chatFlow: ChatFlowModes;
    chatStyle: ChatStyles;
    narratorCharacterId?: string;
    roles: ScenarioRoleResponse[];
    chatsCount: number;
    lastChatTimestamp?: string;
    lastChat: string;
}
export interface ScenarioRoleResponse {
    name: string;
    description?: string;
    defaultCharacterId?: string;
}
export interface PackageItemResponse {
    id: string;
    name: string;
    description: string;
    creator: string;
    explicitContent: boolean;
    version: string;
    dateCreated?: string;
    dateUpdated?: string;
}
