const sessionState = require('./lib-session-state');

module.exports = function (RED) {
    function normalizeArguments(argumentsValue) {
        if (!Array.isArray(argumentsValue)) {
            return [];
        }

        return argumentsValue
            .map((argument) => ({
                name: String(argument?.name || '').trim(),
                type: String(argument?.type || 'String').trim() || 'String',
                description: String(argument?.description || '').trim(),
                required: argument?.required !== false
            }))
            .filter((argument) => argument.name);
    }

    function normalizeAction(action) {
        const name = String(action?.name || action?.Name || '').trim();
        if (!name) {
            return null;
        }

        const setFlags = Array.isArray(action?.setFlags)
            ? action.setFlags
            : String(action?.setFlags || '')
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean);

        return {
            name,
            description: String(action?.description || action?.Description || '').trim(),
            layer: String(action?.layer || action?.Layer || 'default').trim() || 'default',
            timing: String(action?.timing || action?.Timing || 'AfterAssistantMessage').trim() || 'AfterAssistantMessage',
            secret: String(action?.secret || action?.Secret || '').trim(),
            note: String(action?.note || action?.Note || '').trim(),
            cancelReply: action?.cancelReply === true || action?.CancelReply === true,
            setFlags,
            arguments: normalizeArguments(action?.arguments || action?.Arguments)
        };
    }

    function toScenarioAction(action) {
        return {
            name: action.name,
            description: action.description,
            layer: action.layer,
            finalLayer: false,
            timing: action.timing,
            disabled: false,
            cancelReply: !!action.cancelReply,
            arguments: action.arguments,
            effect: {
                secret: action.secret,
                note: action.note,
                setFlags: action.setFlags
            }
        };
    }

    function parseTrigger(rawValue, fallbackMode) {
        const text = String(rawValue || '').trim();
        if (!text) {
            return { mode: fallbackMode || 'add', ref: '' };
        }

        if (text.startsWith('!')) {
            return { mode: 'remove', ref: text.slice(1).trim() };
        }

        if (text.endsWith('!')) {
            return { mode: 'remove', ref: text.slice(0, -1).trim() };
        }

        return { mode: fallbackMode || 'add', ref: text };
    }

    function VoxtaActionsNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.client = config.client || config.connection;
        node.sessionId = config.sessionId || '';
        node.defaultMode = config.defaultMode || 'add';
        node.actions = Array.isArray(config.actions)
            ? config.actions.map(normalizeAction).filter(Boolean)
            : [];
        node.connectionConfig = null;

        const resolveConnectionConfig = () => {
            node.connectionConfig = RED.nodes.getNode(node.client);
            if (!node.connectionConfig) {
                node.status({ fill: 'red', shape: 'ring', text: 'missing signalr client' });
                return null;
            }
            return node.connectionConfig;
        };

        if (!resolveConnectionConfig()) {
            node.status({ fill: 'yellow', shape: 'ring', text: 'waiting for signalr client' });
        }
        const readinessTimer = setInterval(() => {
            if (resolveConnectionConfig()) {
                node.status({ fill: 'green', shape: 'ring', text: 'ready' });
                clearInterval(readinessTimer);
            }
        }, 1500);
        const onReceiveMessage = (payload) => {
            if (!payload || (payload.$type !== 'action' && payload.$type !== 'appTrigger')) {
                return;
            }
            const fallbackState = sessionState.getState(node.client);
            const currentSessionId = node.sessionId || fallbackState.sessionId;
            if (currentSessionId && payload.sessionId && payload.sessionId !== currentSessionId) {
                return;
            }
            node.send({
                topic: payload.$type,
                event: payload.$type,
                payload,
                sessionId: payload.sessionId || currentSessionId,
                voxta: payload,
                voxtaState: { ...fallbackState }
            });
        };
        const listenerTimer = setInterval(() => {
            if (node.connectionConfig?.connection) {
                node.connectionConfig.connection.off('ReceiveMessage', onReceiveMessage);
                node.connectionConfig.connection.on('ReceiveMessage', onReceiveMessage);
                clearInterval(listenerTimer);
            }
        }, 1500);

        const getRegistry = () => node.context().get('registeredActions') || {};
        const setRegistry = (value) => node.context().set('registeredActions', value);

        const getSessionState = (sessionId) => {
            const registry = getRegistry();
            if (!registry[sessionId]) {
                registry[sessionId] = {};
                setRegistry(registry);
            }
            return registry[sessionId];
        };

        const saveSessionState = (sessionId, actionsByName) => {
            const registry = getRegistry();
            registry[sessionId] = actionsByName;
            setRegistry(registry);
        };

        const clearSessionState = (sessionId) => {
            const registry = getRegistry();
            delete registry[sessionId];
            setRegistry(registry);
        };

        const findByReference = (reference) => {
            const ref = String(reference || '').trim();
            if (!ref) {
                return [];
            }

            const byName = node.actions.find((action) => action.name === ref);
            if (byName) {
                return [byName];
            }

            const byLayer = node.actions.filter((action) => action.layer === ref);
            if (byLayer.length > 0) {
                return byLayer;
            }

            return [];
        };

        const updateStatus = (text, fill = 'green', shape = 'dot') => {
            node.status({ fill, shape, text });
        };

        node.on('input', async (msg, send, done) => {
            try {
                const connectionConfig = resolveConnectionConfig();
                if (!connectionConfig) {
                    throw new Error('SignalR client not available');
                }
                const fallbackState = sessionState.getState(node.client);
                const sessionId = msg.sessionId || msg.voxtaState?.sessionId || msg.payload?.sessionId || node.sessionId || fallbackState.sessionId;
                if (!sessionId) {
                    throw new Error('Session ID required');
                }

                const inputMode = msg.mode || msg.actionMode || msg.payload?.mode || msg.payload?.Action || node.defaultMode;
                const triggerValue = msg.action || msg.payload?.action || msg.payload?.name || msg.payload?.Name || msg.payload;
                const { mode, ref } = parseTrigger(triggerValue, inputMode === 'remove' ? 'remove' : 'add');
                if (!ref) {
                    throw new Error('Action name or layer required');
                }

                if (msg.reset === true || msg.payload?.reset === true) {
                    clearSessionState(sessionId);
                    const payload = { $type: 'updateContext', sessionId, contextKey: 'Actions', actions: [] };
                    await connectionConfig.connection.invoke('SendMessage', payload);
                    updateStatus('actions cleared');
                    send({ ...msg, topic: 'voxta-actions', payload, sessionId, mode: 'reset', actionNames: [] });
                    done();
                    return;
                }

                const matches = findByReference(ref);
                if (matches.length === 0) {
                    throw new Error(`No configured action or layer found for "${ref}"`);
                }

                const sessionActions = { ...getSessionState(sessionId) };
                const changedNames = [];

                if (mode === 'remove') {
                    for (const action of matches) {
                        if (sessionActions[action.name]) {
                            delete sessionActions[action.name];
                            changedNames.push(action.name);
                        }
                    }
                } else {
                    for (const action of matches) {
                        sessionActions[action.name] = toScenarioAction(action);
                        changedNames.push(action.name);
                    }
                }

                saveSessionState(sessionId, sessionActions);

                const payload = {
                    $type: 'updateContext',
                    sessionId,
                    contextKey: 'Actions',
                    actions: Object.values(sessionActions)
                };

                await connectionConfig.connection.invoke('SendMessage', payload);
                updateStatus(`${mode}: ${changedNames.join(', ') || ref}`);
                send({
                    ...msg,
                    topic: 'voxta-actions',
                    payload,
                    sessionId,
                    mode,
                    actionNames: changedNames,
                    registeredActions: Object.keys(sessionActions)
                });
                done();
            } catch (error) {
                updateStatus('action failed', 'red', 'ring');
                done(error);
            }
        });

        node.on('close', (done) => {
            clearInterval(readinessTimer);
            clearInterval(listenerTimer);
            if (node.connectionConfig?.connection) {
                node.connectionConfig.connection.off('ReceiveMessage', onReceiveMessage);
            }
            done();
        });
    }

    RED.nodes.registerType('voxta-actions', VoxtaActionsNode);
};
