import { ClientAuthenticateMessage, ClientMessage } from './client';
import { VoxtaWebsocketClientEventMap } from './VoxtaWebsocketClientEventMap';
export declare enum VoxtaConnectionState {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    Authenticated = "Authenticated",
    PendingAuthentication = "PendingAuthentication"
}
export interface IVoxtaWebSocketClient {
    ready: boolean;
    send(message: ClientMessage): void;
    addEventListener<K extends keyof VoxtaWebsocketClientEventMap>(type: K, listener: (ev: VoxtaWebsocketClientEventMap[K]) => void): void;
    removeEventListener<K extends keyof VoxtaWebsocketClientEventMap>(type: K, listener: (ev: VoxtaWebsocketClientEventMap[K]) => void): void;
}
export declare class VoxtaWebSocketClient implements IVoxtaWebSocketClient {
    private _disposed;
    private _eventTarget;
    private connection;
    private _authenticated;
    private authenticationMessage?;
    private _pendingAuthentication;
    get ready(): boolean;
    constructor(wsUrl: string);
    connect(authenticationMessage: ClientAuthenticateMessage): Promise<void>;
    private onReceiveMessage;
    disconnect(): Promise<void>;
    send(message: ClientMessage): Promise<void>;
    addEventListener<K extends keyof VoxtaWebsocketClientEventMap>(type: K, listener: (ev: VoxtaWebsocketClientEventMap[K]) => void): void;
    removeEventListener<K extends keyof VoxtaWebsocketClientEventMap>(type: K, listener: (ev: VoxtaWebsocketClientEventMap[K]) => void): void;
    dispose(): void;
    protected dispatchEvent<K extends keyof VoxtaWebsocketClientEventMap>(event: VoxtaWebsocketClientEventMap[K]): boolean;
    private genericDispatch;
}
