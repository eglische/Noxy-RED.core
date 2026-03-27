const clientState = new Map();

function ensureState(clientId) {
    if (!clientState.has(clientId)) {
        clientState.set(clientId, {
            connected: false,
            authenticated: false,
            sessionId: null,
            chatId: null,
            characterId: null,
            characterName: null
        });
    }
    return clientState.get(clientId);
}

function updateState(clientId, patch) {
    const current = ensureState(clientId);
    const next = { ...current, ...patch };
    clientState.set(clientId, next);
    return next;
}

function clearState(clientId) {
    clientState.delete(clientId);
}

function getState(clientId) {
    return ensureState(clientId);
}

module.exports = {
    getState,
    updateState,
    clearState
};
