import { MessageData, ServiceTypes } from '../../shared';
export interface TextGenRequest {
    prompt: MessageData[];
    maxTokens?: number;
    prefix?: string;
    serviceType?: ServiceTypes;
}
