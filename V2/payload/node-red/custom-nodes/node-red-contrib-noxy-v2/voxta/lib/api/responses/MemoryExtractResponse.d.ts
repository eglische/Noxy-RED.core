export interface MemoryExtractResponse {
    items: MemoryExtractItemResponse[];
}
export interface MemoryExtractItemResponse {
    keywords: string[];
    text: string;
    weight: number;
}
