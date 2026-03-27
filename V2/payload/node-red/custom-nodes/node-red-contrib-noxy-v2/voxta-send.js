const sessionState = require('./lib-session-state');

module.exports = function (RED) {
    function normalizeMessage(message, index) {
        return {
            index: index + 1,
            name: String(message?.name || message?.eventName || '').trim(),
            shortRef: String(message?.shortRef || '').trim(),
            flag: String(message?.flag || '').trim(),
            content: String(message?.content || message?.text || '').trim(),
            additionalMessages: Array.isArray(message?.additionalMessages)
                ? message.additionalMessages.map((value) => String(value).trim()).filter(Boolean)
                : String(message?.additionalMessages || '').split(',').map((value) => value.trim()).filter(Boolean)
        };
    }

    function formatLine(message) {
        const prefix = message.flag ? `/${message.flag}` : '';
        return [prefix, message.content].filter(Boolean).join(' ').trim();
    }

    function VoxtaSendNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.client = config.client || config.connection;
        node.text = config.text || '';
        node.sessionId = config.sessionId || '';
        node.forwardUnmatched = config.forwardUnmatched !== false && config.forwardUnmatched !== 'false';
        node.messages = Array.isArray(config.messages)
            ? config.messages.map((message, index) => normalizeMessage(message, index)).filter((message) => message.content)
            : [];
        node.connectionConfig = null;
        node.currentIndex = 0;

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

        const findMessage = (reference) => {
            const ref = String(reference || '').trim();
            if (!ref) {
                return null;
            }
            const numeric = Number.parseInt(ref, 10);
            return node.messages.find((message) =>
                message.shortRef === ref ||
                message.name === ref ||
                message.index === numeric
            ) || null;
        };

        const expandMessage = (message, seen = new Set()) => {
            if (!message || seen.has(message.shortRef || message.name || message.index)) {
                return [];
            }
            const key = message.shortRef || message.name || message.index;
            seen.add(key);
            const lines = [formatLine(message)].filter(Boolean);
            for (const ref of message.additionalMessages) {
                const nested = findMessage(ref);
                if (nested) {
                    lines.push(...expandMessage(nested, seen));
                }
            }
            return lines;
        };

        const resolveLines = (msg) => {
            if (Array.isArray(msg.payload)) {
                return msg.payload.map((value) => String(value).trim()).filter(Boolean);
            }

            const directText = msg.text || msg.payload?.text || (typeof msg.payload === 'string' ? msg.payload : '') || node.text;
            const directRef = msg.shortRef || msg.messageRef || msg.payload?.shortRef || msg.payload?.messageRef;
            const selector = String(directRef || directText || '').trim();
            if (!selector) {
                return [];
            }

            if (selector.toLowerCase() === 'random' && node.messages.length > 0) {
                const randomIndex = Math.floor(Math.random() * node.messages.length);
                node.currentIndex = randomIndex;
                return expandMessage(node.messages[randomIndex]);
            }

            if (selector.toLowerCase() === 'next' && node.messages.length > 0) {
                node.currentIndex = Math.min(node.currentIndex, node.messages.length - 1);
                const message = node.messages[node.currentIndex];
                node.currentIndex = Math.min(node.currentIndex + 1, node.messages.length - 1);
                return expandMessage(message);
            }

            if (selector.toLowerCase() === 'previous' && node.messages.length > 0) {
                node.currentIndex = Math.max(node.currentIndex - 1, 0);
                return expandMessage(node.messages[node.currentIndex]);
            }

            const preset = findMessage(selector);
            if (preset) {
                return expandMessage(preset);
            }

            return node.forwardUnmatched ? [selector] : [];
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

                const lines = resolveLines(msg);
                if (lines.length === 0) {
                    throw new Error(node.forwardUnmatched ? 'No text to send' : 'No matching preset found');
                }

                for (const line of lines) {
                    await connectionConfig.connection.invoke('SendMessage', {
                        $type: 'send',
                        sessionId,
                        text: line
                    });
                }

                node.status({ fill: 'green', shape: 'dot', text: `sent ${lines.length}` });
                send({ ...msg, payload: lines.length === 1 ? lines[0] : lines, sessionId, topic: 'send' });
                done();
            } catch (error) {
                node.status({ fill: 'red', shape: 'ring', text: 'send failed' });
                done(error);
            }
        });

        node.on('close', (done) => {
            clearInterval(readinessTimer);
            done();
        });
    }

    RED.nodes.registerType('voxta-messages', VoxtaSendNode);
};
