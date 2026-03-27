const sessionState = require('./lib-session-state');

module.exports = function (RED) {
    function VoxtaEventsNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.client = config.client || config.connection;
        node.eventFilter = (config.eventFilter || '').trim();
        node.outputMode = config.outputMode || 'split';
        node.connectionConfig = RED.nodes.getNode(node.client);

        if (!node.connectionConfig) {
            node.status({ fill: 'red', shape: 'ring', text: 'missing signalr client' });
            return;
        }

        const matches = (eventName) => {
            if (!node.eventFilter) {
                return true;
            }
            return node.eventFilter
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
                .includes(eventName);
        };

        const currentState = sessionState.getState(node.client);
        let authInFlight = false;

        const updateStatus = (text, fill = 'green', shape = 'dot') => {
            node.status({ fill, shape, text });
        };

        const sendMessage = (message) => node.connectionConfig.connection.invoke('SendMessage', message);

        const authenticate = () => {
            if (authInFlight || !node.connectionConfig?.connection) {
                return;
            }
            authInFlight = true;
            updateStatus('authenticating', 'yellow', 'ring');
            sendMessage({
                $type: 'authenticate',
                client: 'Voxta.NoxyRed',
                clientVersion: '1.0.0',
                scope: ['role:app', 'role:inspector'],
                capabilities: {
                    audioOutput: 'Url',
                    audioInput: 'WebSocketStream'
                }
            }).catch((error) => {
                authInFlight = false;
                node.error(error);
                updateStatus('auth failed', 'red', 'ring');
            });
        };

        const emitEvent = (eventName, payload) => {
            if (!matches(eventName)) {
                return;
            }

            const msg = {
                topic: eventName,
                event: eventName,
                payload,
                voxta: payload,
                sessionId: payload?.sessionId || payload?.SessionId || currentState.sessionId,
                chatId: payload?.chatId || payload?.ChatId || currentState.chatId,
                characterId: payload?.senderId || payload?.SenderId || currentState.characterId,
                voxtaState: { ...currentState }
            };

            if (node.outputMode === 'split') {
                if (eventName === 'replyChunk' || eventName === 'replyStart' || eventName === 'replyEnd' || eventName === 'replyGenerating') {
                    node.send([msg, null, null]);
                } else if (eventName === 'action' || eventName === 'appTrigger') {
                    node.send([null, msg, null]);
                } else {
                    node.send([null, null, msg]);
                }
                return;
            }

            node.send([msg, null, null]);
        };

        const onOpened = () => {
            currentState.connected = true;
            currentState.authenticated = false;
            sessionState.updateState(node.client, { connected: true, authenticated: false });
            updateStatus('connected', 'yellow', 'ring');
            authenticate();
        };

        const onError = (event) => {
            updateStatus('error', 'red', 'ring');
            node.error(event?.err || event);
        };

        const onClosed = () => {
            currentState.connected = false;
            currentState.authenticated = false;
            authInFlight = false;
            sessionState.updateState(node.client, { connected: false, authenticated: false });
            updateStatus('disconnected', 'red', 'ring');
        };

        const onReceiveMessage = (payload) => {
            if (!payload || !payload.$type) {
                return;
            }

            if (payload.$type === 'welcome') {
                authInFlight = false;
                currentState.authenticated = true;
                sessionState.updateState(node.client, { authenticated: true });
                if (currentState.sessionId && currentState.chatId) {
                    sendMessage({
                        $type: 'subscribeToChat',
                        sessionId: currentState.sessionId,
                        chatId: currentState.chatId
                    }).catch((error) => node.error(error));
                }
            } else if (payload.$type === 'chatsSessionsUpdated') {
                const first = Array.isArray(payload.sessions) ? payload.sessions[0] : null;
                if (first) {
                    currentState.sessionId = first.sessionId || currentState.sessionId;
                    currentState.chatId = first.chatId || currentState.chatId;
                    sessionState.updateState(node.client, {
                        sessionId: currentState.sessionId,
                        chatId: currentState.chatId
                    });
                    sendMessage({
                        $type: 'subscribeToChat',
                        sessionId: first.sessionId,
                        chatId: first.chatId
                    }).catch((error) => node.error(error));
                }
            } else if (payload.$type === 'chatStarted') {
                currentState.sessionId = payload.sessionId || currentState.sessionId;
                currentState.chatId = payload.chatId || currentState.chatId;
                const firstCharacter = Array.isArray(payload.characters) ? payload.characters[0] : null;
                currentState.characterId = firstCharacter?.id || firstCharacter?.Id || currentState.characterId;
                currentState.characterName = firstCharacter?.name || firstCharacter?.Name || currentState.characterName;
                sessionState.updateState(node.client, {
                    sessionId: currentState.sessionId,
                    chatId: currentState.chatId,
                    characterId: currentState.characterId,
                    characterName: currentState.characterName
                });
            } else if (payload.$type === 'chatClosed') {
                currentState.chatId = null;
                currentState.characterId = null;
                currentState.characterName = null;
                sessionState.updateState(node.client, {
                    chatId: null,
                    characterId: null,
                    characterName: null
                });
            } else if (payload.$type === 'error' && typeof payload.message === 'string' && payload.message.includes('authenticate first')) {
                authInFlight = false;
                currentState.authenticated = false;
                sessionState.updateState(node.client, { authenticated: false });
                authenticate();
            }

            const statusLabel = currentState.characterName
                ? `${payload.$type} · ${currentState.characterName}`
                : payload.$type;
            updateStatus(statusLabel, 'green', 'dot');
            emitEvent(payload.$type, payload);
        };

        node.connectionConfig.on('opened', onOpened);
        node.connectionConfig.on('erro', onError);
        node.connectionConfig.on('closed', onClosed);

        if (node.connectionConfig.connection) {
            node.connectionConfig.connection.on('ReceiveMessage', onReceiveMessage);
        }

        node.on('close', (done) => {
            if (node.connectionConfig) {
                node.connectionConfig.removeListener('opened', onOpened);
                node.connectionConfig.removeListener('erro', onError);
                node.connectionConfig.removeListener('closed', onClosed);
                if (node.connectionConfig.connection) {
                    node.connectionConfig.connection.off('ReceiveMessage', onReceiveMessage);
                }
            }
            done();
        });
    }

    RED.nodes.registerType('voxta-events', VoxtaEventsNode);
};
