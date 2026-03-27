import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { WhoAmIUserResponse } from '../responses';
export declare class AuthApiClient extends VoxtaApiClientBase {
    signin(request: {
        username: string;
        password: string;
        rememberMe: boolean;
    }): Promise<void>;
    signout(): Promise<void>;
    change(request: {
        oldPassword: string;
        newPassword: string;
    }): Promise<void>;
    nonce(): Promise<{
        nonce: string;
    }>;
    test(): Promise<WhoAmIUserResponse>;
}
