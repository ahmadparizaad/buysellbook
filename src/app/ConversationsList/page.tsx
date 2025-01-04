import React from 'react';

interface Conversation {
    uid: string;
    name?: string;
    lastMessage?: string;
    timestamp?: number;
}

interface ConversationsListProps {
    conversations: Conversation[];
    startChat: (receiverUid: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ conversations, startChat }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            
                    <h2 className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-24">Recent Chats</h2>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.uid}
                            className="border-b rounded-xl p-5 hover:bg-gray-800 cursor-pointer"
                            onClick={() => startChat(conversation.uid)}
                        >
                            <div className="font-medium">{conversation.name || conversation.uid}</div>
                            <div className="flex justify-between text-sm pt-2 text-gray-400">
                                {conversation.lastMessage || 'No messages yet'}
                                {conversation.timestamp && (
                                    <div className="ml-auto right-2 text-xs text-gray-400">
                                        {new Date(conversation.timestamp * 1000).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
        </div>
    );
};

export default ConversationsList;