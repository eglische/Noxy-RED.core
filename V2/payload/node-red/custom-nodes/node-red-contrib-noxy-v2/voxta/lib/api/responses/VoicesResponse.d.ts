import { VoiceInfo } from '../../shared';
import { FormField } from '../form';
export interface VoicesResponse {
    serviceId: string;
    serviceName: string;
    serviceLabel: string;
    culture: string;
    voices: VoiceInfo[];
    fields: FormField[];
}
