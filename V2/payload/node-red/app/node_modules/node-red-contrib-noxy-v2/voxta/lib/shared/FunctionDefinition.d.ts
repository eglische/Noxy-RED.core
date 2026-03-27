import { ActionEffect } from './ActionEffect';
import { FunctionTiming } from './FunctionTiming';
export interface FunctionDefinition {
    disabled: boolean;
    name: string;
    description: string;
    arguments?: {
        name: string;
        description?: string;
        required?: boolean;
    }[];
    timing?: FunctionTiming;
    cancelReply?: boolean;
    once?: boolean;
    roleFilter?: string;
    flagsFilter?: string;
    matchFilter?: string[];
    effect: ActionEffect;
}
