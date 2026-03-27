export interface AudioInputSpecifications {
    contentType: string;
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    bufferMilliseconds: number;
}
