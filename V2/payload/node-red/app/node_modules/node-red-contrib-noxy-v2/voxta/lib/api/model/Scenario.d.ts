import { ChatFlowModes, ChatStyles, ContextDefinition, FunctionDefinition } from '../../shared';
import { ImportableObject } from './ImportableObject';
export interface Scenario extends ImportableObject {
    packageId?: string;
    initScript?: string;
    sharedScripts: ScriptFile[];
    client?: string;
    explicitContent: boolean;
    description?: string;
    creator?: string;
    actions: ScenarioAction[];
    contexts: ContextDefinition[];
    parentId?: string;
    favorite: boolean;
    chatFlow: ChatFlowModes;
    chatStyle: ChatStyles;
    template: string;
    messages?: string;
    systemPrompt?: string;
    memoryBooks: string[];
    narratorCharacterId?: string;
    roles: ScenarioRole[];
    impersonation?: ScenarioImpersonation;
    events: ScenarioEvent[];
}
export interface ScriptFile {
    name: string;
    content: string;
}
export interface ScenarioImpersonation {
    name?: string;
    description?: string;
}
export interface ScenarioRole {
    name: string;
    description?: string;
    defaultCharacterId?: string;
    enabledOnStart: boolean;
}
export interface ScenarioEvent extends FunctionDefinition {
    evaluateNextEvent?: boolean;
    probability?: number;
    minMessagesCount?: number;
    maxMessagesCount?: number;
    minChatTimeSeconds?: number;
    maxChatTimeSeconds?: number;
    sinceFlag?: string;
}
export interface ScenarioAction extends FunctionDefinition {
    shortDescription?: string;
    layer: string;
    finalLayer?: boolean;
    arguments: FunctionArgumentDefinition[];
    activates?: string[];
}
export interface FunctionArgumentDefinition {
    name: string;
    type: FunctionArgumentType;
    description?: string;
    required?: boolean;
}
export declare enum FunctionArgumentType {
    Undefined = "Undefined",
    String = "String",
    Integer = "Integer"
}
