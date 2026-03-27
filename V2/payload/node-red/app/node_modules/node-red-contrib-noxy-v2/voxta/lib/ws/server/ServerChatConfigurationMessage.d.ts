import { ChatParticipantInfo, EnabledChatAugmentation, ScenarioInfo } from '../../shared';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerChatConfigurationMessageBase extends ServerChatSessionMessage {
    chatId: string;
    user: ChatParticipantInfo;
    characters: ChatParticipantInfo[];
    narrator?: ChatParticipantInfo;
    scenario: ScenarioInfo;
    augmentations: EnabledChatAugmentation[];
    services: ChatServices;
}
export interface ChatServices {
    textGen: ServiceInfo;
    textToSpeech?: ServiceInfo;
    speechToText?: ServiceInfo;
    actionInference?: ServiceInfo;
    summarization?: ServiceInfo;
}
export interface ServiceInfo {
    serviceName: string;
    serviceId: string;
}
export interface ServerChatConfigurationMessage extends ServerChatConfigurationMessageBase {
    $type: 'chatConfiguration';
}
