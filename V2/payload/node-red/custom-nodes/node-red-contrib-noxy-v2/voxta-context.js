const sessionState = require('./lib-session-state');

module.exports = function (RED) {
    function normalizeContext(context) {
        return {
            name: String(context?.name || context?.Name || '').trim(),
            text: String(context?.text || context?.Text || '').trim(),
            disabled: context?.disabled === true || context?.Disabled === true,
            setFlags: Array.isArray(context?.setFlags || context?.SetFlags)
                ? (context.setFlags || context.SetFlags).map((value) => String(value).trim()).filter(Boolean)
                : String(context?.setFlags || context?.SetFlags || '').split(',').map((value) => value.trim()).filter(Boolean)
        };
    }

    function parseContextReference(rawValue) {
        const text = String(rawValue || '').trim();
        if (!text) {
            return { name: '', disabled: false };
        }
        if (text.startsWith('!')) {
            return { name: text.slice(1).trim(), disabled: true };
        }
        if (text.endsWith('!')) {
            return { name: text.slice(0, -1).trim(), disabled: true };
        }
        return { name: text, disabled: false };
    }

    function VoxtaContextNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.client = config.client || config.connection;
        node.contextKey = config.contextKey || '';
        node.contextText = config.contextText || '';
        node.setFlags = config.setFlags || '';
        node.disabled = config.disabled === true || config.disabled === 'true';
        node.sessionId = config.sessionId || '';
        node.contexts = Array.isArray(config.contexts)
            ? config.contexts.map(normalizeContext).filter((context) => context.name && context.text)
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

        const findContext = (reference) => {
            const ref = String(reference || '').trim();
            return node.contexts.find((context) => context.name === ref) || null;
        };

        node.on('input', async (msg, send, done) => {
            try {
                const connectionConfig = resolveConnectionConfig();
                if (!connectionConfig) {
                    throw new Error('SignalR client not available');
                }

                const fallbackState = sessionState.getState(node.client);
                const sessionId = msg.sessionId || msg.payload?.sessionId || node.sessionId || fallbackState.sessionId;
                if (!sessionId) {
                    throw new Error('Session ID required');
                }

                let payload;
                if (typeof msg.payload === 'string') {
                    const parsed = parseContextReference(msg.payload);
                    const context = findContext(parsed.name);
                    if (!context) {
                        throw new Error(`No configured context found for "${msg.payload}"`);
                    }
                    payload = {
                        $type: 'updateContext',
                        sessionId,
                        contextKey: context.name,
                        contexts: [{
                            name: context.name,
                            text: context.text,
                            disabled: parsed.disabled
                        }]
                    };
                    if (context.setFlags.length > 0) {
                        payload.setFlags = context.setFlags;
                    }
                } else {
                    const contextKey = msg.contextKey || msg.payload?.contextKey || msg.payload?.ContextKey || node.contextKey;
                    const contextText = msg.contextText || msg.payload?.contexts?.[0]?.text || msg.payload?.Contexts?.[0]?.Text || node.contextText;
                    const disabled = msg.disabled ?? msg.payload?.contexts?.[0]?.disabled ?? msg.payload?.Contexts?.[0]?.Disabled ?? node.disabled;
                    if (!contextKey || !contextText) {
                        throw new Error('ContextKey and context text are required');
                    }
                    payload = {
                        $type: 'updateContext',
                        sessionId,
                        contextKey,
                        contexts: [{ text: contextText, disabled: !!disabled }]
                    };
                    const flags = msg.setFlags || msg.payload?.setFlags || msg.payload?.SetFlags || node.setFlags;
                    if (flags) {
                        payload.setFlags = Array.isArray(flags)
                            ? flags.map((value) => String(value).trim()).filter(Boolean)
                            : String(flags).split(',').map((item) => item.trim()).filter(Boolean);
                    }
                }

                await connectionConfig.connection.invoke('SendMessage', payload);
                node.status({ fill: 'green', shape: 'dot', text: payload.contextKey });
                send({ ...msg, payload, topic: 'updateContext' });
                done();
            } catch (error) {
                node.status({ fill: 'red', shape: 'ring', text: 'context failed' });
                done(error);
            }
        });

        node.on('close', (done) => {
            clearInterval(readinessTimer);
            done();
        });
    }

    RED.nodes.registerType('voxta-context', VoxtaContextNode);
};
