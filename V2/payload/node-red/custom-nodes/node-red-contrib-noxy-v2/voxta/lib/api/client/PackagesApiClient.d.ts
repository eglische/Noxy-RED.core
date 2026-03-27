import { VoxtaApiClientBase } from './VoxtaApiClientBase';
import { ContentPackageItemResponse, ContentPackagesResponse } from '../responses';
import { ContentPackage } from '../model';
export declare class PackagesApiClient extends VoxtaApiClientBase {
    getPackages(): Promise<ContentPackagesResponse>;
    getPackage(id: string): Promise<ContentPackage>;
    getPackageInfo(id: string): Promise<ContentPackageItemResponse>;
    updatePackage(packageId: string, value: ContentPackage): Promise<ContentPackage>;
    deletePackage(packageId: string): Promise<void>;
    createPackage(): Promise<ContentPackageItemResponse>;
    unlockObject(objectId: string): Promise<void>;
}
