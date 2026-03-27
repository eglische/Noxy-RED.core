export type ServerCharacterLoadedMessage = {
    $type: 'characterLoaded';
    character: {
        name: string;
    };
};
