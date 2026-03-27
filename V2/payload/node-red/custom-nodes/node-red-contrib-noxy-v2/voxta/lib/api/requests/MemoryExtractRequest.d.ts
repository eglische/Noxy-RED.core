import { ChatMessageRole } from '../../shared';
export interface MemoryExtractRequest {
    character: string;
    culture?: string;
    messages: MessageData[];
}
interface MessageData {
    role: ChatMessageRole;
    user?: string;
    value: string;
}
export {};
