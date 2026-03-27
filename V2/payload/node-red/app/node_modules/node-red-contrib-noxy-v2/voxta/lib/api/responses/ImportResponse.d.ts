export interface ImportResponse {
    entries: ImportResponseEntry[];
}
export interface ImportResponseEntry {
    kind: 'Character' | 'MemoryBook' | 'Scenario' | 'Package' | 'Chat' | 'Unknown';
    id: string;
    name: string;
    thumbnailUrl?: string;
    error?: string;
}
