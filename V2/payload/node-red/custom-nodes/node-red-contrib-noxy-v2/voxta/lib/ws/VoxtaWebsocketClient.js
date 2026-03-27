"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoxtaWebSocketClient = exports.VoxtaConnectionState = void 0;
const tslib_1 = require("tslib");
const signalR = require("@microsoft/signalr");
/* Use this to simulate reconnect
class MockWebSocket extends WebSocket {
  static sockets: WebSocket[] = [];

  constructor(url: string | URL, protocols?: string | string[]) {
    super(url, protocols);

    MockWebSocket.sockets.push(this);
  }
}
window.WebSocket = MockWebSocket;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).mockWebSocketDisconnect = () => MockWebSocket.sockets.forEach((s) => s.close());
*/
var VoxtaConnectionState;
(function (VoxtaConnectionState) {
    VoxtaConnectionState["Disconnected"] = "Disconnected";
    VoxtaConnectionState["Connecting"] = "Connecting";
    VoxtaConnectionState["Connected"] = "Connected";
    VoxtaConnectionState["Authenticated"] = "Authenticated";
    VoxtaConnectionState["PendingAuthentication"] = "PendingAuthentication";
})(VoxtaConnectionState || (exports.VoxtaConnectionState = VoxtaConnectionState = {}));
class VoxtaWebSocketClient {
    get ready() {
        return !this._disposed && this._authenticated;
    }
    constructor(wsUrl) {
        this._disposed = false;
        this._eventTarget = new EventTarget();
        this._authenticated = false;
        this._pendingAuthentication = false;
        this.onReceiveMessage = (message) => {
            if (message.$type != 'audioFrame') {
                console.log('<- ', message);
            }
            if (message.$type == 'welcome') {
                this._authenticated = true;
                this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Authenticated }));
            }
            else if (message.$type == 'authenticationRequired') {
                this._pendingAuthentication = true;
                this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.PendingAuthentication }));
            }
            this.genericDispatch(message.$type, message);
        };
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(wsUrl, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        })
            .withAutomaticReconnect([...Array.from({ length: 10 }, () => 1000)])
            .configureLogging(signalR.LogLevel.Information)
            .build();
        this.connection.on('ReceiveMessage', this.onReceiveMessage);
        this.connection.onreconnecting(() => {
            this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Disconnected }));
            this._pendingAuthentication = false;
            this._authenticated = false;
            this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Connecting }));
        });
        this.connection.onreconnected(() => {
            this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Connected }));
            this.connection.send('SendMessage', this.authenticationMessage);
        });
        this.connection.onclose(() => {
            this._pendingAuthentication = false;
            this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Disconnected }));
        });
    }
    connect(authenticationMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._pendingAuthentication) {
                this._pendingAuthentication = false;
                yield this.connection.send('SendMessage', authenticationMessage);
                return;
            }
            this.authenticationMessage = authenticationMessage;
            this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Connecting }));
            // Try 30 times to connect
            for (let i = 0; i < 30; i++) {
                try {
                    yield this.connection.start();
                    break;
                }
                catch (e) {
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
            if (this.connection.state == signalR.HubConnectionState.Connected) {
                try {
                    this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Connected }));
                    yield this.connection.send('SendMessage', authenticationMessage);
                }
                catch (e) {
                    this.dispatchEvent(new ErrorEvent('wserror', { error: e }));
                }
            }
            else {
                this.dispatchEvent(new CustomEvent('state', { detail: VoxtaConnectionState.Disconnected }));
            }
        });
    }
    disconnect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.connection.stop();
        });
    }
    send(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._pendingAuthentication)
                return;
            console.log(' ->', message);
            try {
                yield this.connection.send('SendMessage', message);
            }
            catch (e) {
                console.error('Error sending message', e);
                this.dispatchEvent(new ErrorEvent('wserror', { error: e }));
            }
        });
    }
    addEventListener(type, listener) {
        this._eventTarget.addEventListener(type, listener);
    }
    removeEventListener(type, listener) {
        this._eventTarget.removeEventListener(type, listener);
    }
    dispose() {
        this.disconnect();
    }
    dispatchEvent(event) {
        return this._eventTarget.dispatchEvent(event);
    }
    genericDispatch(type, message) {
        return this._eventTarget.dispatchEvent(new CustomEvent(type, { detail: message }));
    }
}
exports.VoxtaWebSocketClient = VoxtaWebSocketClient;
//# sourceMappingURL=VoxtaWebsocketClient.js.map