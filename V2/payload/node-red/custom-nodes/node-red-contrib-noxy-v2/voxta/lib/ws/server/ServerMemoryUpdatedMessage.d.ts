import { MemoryItemEntry } from '../../shared/MemoryItemEntry';
import { ServerChatSessionMessage } from './ServerChatSessionMessage';
export interface ServerMemoryUpdatedMessage extends ServerChatSessionMessage {
    $type: 'memoryUpdated';
    characterId: string;
    memories: MemoryItemEntry[];
}
