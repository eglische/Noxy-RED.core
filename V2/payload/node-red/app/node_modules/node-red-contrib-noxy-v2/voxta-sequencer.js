module.exports = function (RED) {
    function cloneMessage(message) {
        return RED.util.cloneMessage(message);
    }

    function getRandomDelay(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    function toMilliseconds(step) {
        const from = Number(step.from || 0);
        const to = Number(step.to || step.from || 0);
        const factor = step.unit === 'minutes' ? 60000 : step.unit === 'seconds' ? 1000 : 1;
        const lower = Math.max(0, Math.min(from, to) * factor);
        const upper = Math.max(0, Math.max(from, to) * factor);
        return lower === upper ? lower : getRandomDelay(lower, upper);
    }

    function parseOutputValue(step) {
        const raw = step.value ?? '';
        switch (step.outputType) {
        case 'boolean':
            return String(raw).toLowerCase() === 'true';
        case 'number':
            return Number(raw);
        case 'json':
            return JSON.parse(raw);
        default:
            return String(raw);
        }
    }

    function wait(milliseconds, stopRef) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                stopRef.timer = null;
                resolve();
            }, milliseconds);
            stopRef.timer = timeout;
            stopRef.cancel = () => {
                clearTimeout(timeout);
                stopRef.timer = null;
                reject(new Error('Sequence stopped'));
            };
        });
    }

    function VoxtaSequencerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.sequence = Array.isArray(config.sequence) ? config.sequence : [];

        let running = false;
        let stopRef = { timer: null, cancel: null };

        async function executeSequence(msg, send, done) {
            running = true;
            node.status({ fill: 'green', shape: 'dot', text: 'running' });

            try {
                for (const step of node.sequence) {
                    if (step.type === 'output') {
                        const outputMsg = cloneMessage(msg);
                        outputMsg.payload = parseOutputValue(step);
                        send(outputMsg);
                        continue;
                    }

                    if (step.type === 'delay') {
                        const milliseconds = toMilliseconds(step);
                        if (milliseconds > 0) {
                            await wait(milliseconds, stopRef);
                        }
                    }
                }

                node.status({ fill: 'blue', shape: 'dot', text: 'finished' });
                done();
            } catch (error) {
                if (error && error.message === 'Sequence stopped') {
                    node.status({ fill: 'red', shape: 'ring', text: 'stopped' });
                    done();
                    return;
                }
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                done(error);
            } finally {
                running = false;
                stopRef = { timer: null, cancel: null };
            }
        }

        node.on('input', function (msg, send, done) {
            send = send || function () { node.send.apply(node, arguments); };
            done = done || function (err) { if (err) { node.error(err, msg); } };

            if (typeof msg.payload === 'string' && msg.payload.trim().toLowerCase() === 'stop!') {
                if (running && typeof stopRef.cancel === 'function') {
                    stopRef.cancel();
                } else {
                    node.status({ fill: 'red', shape: 'ring', text: 'stopped' });
                }
                done();
                return;
            }

            executeSequence(msg, send, done).catch((error) => {
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                done(error);
            });
        });

        node.on('close', function () {
            if (typeof stopRef.cancel === 'function') {
                stopRef.cancel();
            }
        });
    }

    RED.nodes.registerType('voxta-sequencer', VoxtaSequencerNode);
};
