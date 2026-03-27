import { VoxtaConnectionState } from './VoxtaWebsocketClient';
import { VoxtaServerMessageEventMap } from './server';
export type VoxtaWebsocketClientEventMap = {
    state: CustomEvent<VoxtaConnectionState>;
    wserror: ErrorEvent;
} & VoxtaServerMessageEventMap;
