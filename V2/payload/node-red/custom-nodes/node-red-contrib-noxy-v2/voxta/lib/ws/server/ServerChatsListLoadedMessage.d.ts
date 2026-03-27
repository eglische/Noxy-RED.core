export type ServerChatsListLoadedMessage = {
    $type: 'chatsListLoaded';
    chats: Chat[];
};
export type Chat = {
    id: string;
    created: string;
};
