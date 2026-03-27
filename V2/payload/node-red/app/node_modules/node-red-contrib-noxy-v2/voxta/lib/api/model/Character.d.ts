import { ChatStyles, VoiceInfo } from '../../shared';
import { ImportableObject } from './ImportableObject';
import { ScriptFile } from './Scenario';
export interface Character extends ImportableObject {
    packageId?: string;
    creator?: string;
    creatorNotes?: string;
    culture: string;
    augmentations: string[];
    explicitContent: boolean;
    importedFrom?: string;
    userNameOverride?: string;
    userDescriptionOverride?: string;
    textToSpeech: VoiceServiceMap[];
    enableThinkingSpeech: boolean;
    notifyUserAwayReturn: boolean;
    timeAware: boolean;
    useMemory: boolean;
    description?: string;
    personality?: string;
    scenario?: string;
    firstMessage?: string;
    messageExamples?: string;
    systemPrompt?: string;
    postHistoryInstructions?: string;
    tags?: string[];
    maxTokens?: number;
    maxSentences?: number;
    label?: string;
    profile?: string;
    context?: string;
    instructions?: string;
    chatStyle: ChatStyles;
    scripts: ScriptFile[];
    defaultScenarios?: CharacterDefaultScenarioAssignation[];
    memoryBooks: string[];
    favorite: boolean;
    scenarioOnly: boolean;
}
export interface VoiceServiceMap {
    service?: {
        serviceName: string;
        serviceId?: string;
    };
    voice: VoiceInfo;
}
export interface CharacterDefaultScenarioAssignation {
    clientId: string;
    scenarioId: string;
}
