import { ImageInfoResponse, ProfileResponse } from '../responses';
import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { CreateProfileRequest } from '../requests';
export declare class ProfilesApiClient extends VoxtaApiClientBase {
    getProfile(): Promise<ProfileResponse>;
    createProfile(settings: CreateProfileRequest): Promise<ProfileResponse>;
    updateProfile(settings: ProfileResponse): Promise<ProfileResponse>;
    updateProfileThumbnail(file: File): Promise<ImageInfoResponse>;
    deleteProfileThumbnail(): Promise<void>;
}
