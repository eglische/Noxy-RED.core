import { OwnedEntity } from './OwnedEntity';
export interface App extends OwnedEntity {
    clientId: string;
    dateCreated: string;
    dateModified: string;
}
