export interface AppsResponse {
    apps: AppItemResponse[];
}
export interface AppItemResponse {
    id: string;
    clientId: string;
    dateCreated: string;
    dateCreatedAgo: string;
    dateModified: string;
    dateModifiedAgo: string;
}
