import { VoxtaUserRoles } from '../../shared';
export interface UsersResponse {
    users: VoxtaUserItemResponse[];
}
export interface VoxtaUserItemResponse {
    id: string;
    userName: string;
    role: VoxtaUserRoles;
    dateCreated: string;
    dateCreatedAgo: string;
}
