import { WhoAmIUserResponse } from './WhoAmIResponse';
export interface FrontEndInitResponse {
    version: string;
    user?: WhoAmIUserResponse;
    featureFlags: string[];
    secure: boolean;
}
