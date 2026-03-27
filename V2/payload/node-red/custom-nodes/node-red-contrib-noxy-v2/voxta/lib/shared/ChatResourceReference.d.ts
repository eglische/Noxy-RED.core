import { ChatResourceKind } from './ChatResourceKind';
export interface ChatResourceReference {
    kind: ChatResourceKind;
    id: string;
}
export interface ChatResourceStatusInformation extends ChatResourceReference {
    version: string;
    status: ChatResourceAvailabilityStatus;
}
export declare enum ChatResourceAvailabilityStatus {
    Unspecified = "Unspecified",
    Exists = "Exists",
    NotFound = "NotFound",
    VersionMismatch = "VersionMismatch"
}
