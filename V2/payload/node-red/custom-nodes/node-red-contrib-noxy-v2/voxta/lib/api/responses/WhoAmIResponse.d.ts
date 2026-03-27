import { VoxtaUserRoles } from '../../shared';
export interface WhoAmIUserResponse {
    id: string;
    name: string;
    role: VoxtaUserRoles;
}
