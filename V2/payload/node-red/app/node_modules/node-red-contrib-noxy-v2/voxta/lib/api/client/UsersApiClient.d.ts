import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { UsersResponse, VoxtaUserItemResponse } from '../responses';
import { UpdateUserRequest } from '../requests/UpdateUserRequest';
export declare class UsersApiClient extends VoxtaApiClientBase {
    getUsers(): Promise<UsersResponse>;
    getUser(id: string): Promise<VoxtaUserItemResponse>;
    createUser(username: string, password: string): Promise<VoxtaUserItemResponse>;
    deleteUser(id: string): Promise<void>;
    patchUser(id: string, data: UpdateUserRequest): Promise<void>;
}
