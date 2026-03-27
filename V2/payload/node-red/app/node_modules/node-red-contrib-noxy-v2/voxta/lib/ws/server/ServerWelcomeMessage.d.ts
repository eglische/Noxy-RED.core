import { ChatParticipantInfo } from '../../shared';
export type ServerWelcomeMessage = {
    $type: 'welcome';
    voxtaServerVersion?: string;
    user: ChatParticipantInfo;
    assistant?: ChatParticipantInfo;
};
