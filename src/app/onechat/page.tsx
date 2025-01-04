'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ConversationsList from '../ConversationsList/page';
import { cometchatAuth } from '@/utils/cometchatAuth';
import Chat from '../chat/page';

export interface Message {
    id: string;
    text: string;
    sender: {
        uid: string;
        name: string;
    };
    sentAt: number;
}

export interface Conversation {
    uid: string;
    name?: string;
    lastMessage?: string;
    timestamp?: number;
}

const OneChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [senderUID, setSenderUID] = useState('');
    const [recieverUID, setRecieverUID] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const reciever = searchParams.get('reciever');
    const router = useRouter();

    let CometChat: any;
    if (typeof window !== "undefined") {
        CometChat = require("@cometchat/chat-sdk-javascript").CometChat;
        window.CometChat = CometChat;
    }

    // Initialize chat and fetch previous messages  
    const initializeChat = useCallback(async () => {
        if (!senderUID) {
            console.log('Waiting for senderUID...');
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            await cometchatAuth.init();
            const login = await cometchatAuth.login(senderUID);
            console.log(login);
            setIsLoading(false);
        } catch (error) {
            console.error('Error initializing chat:', error);
            setError('Failed to initialize chat');
        }
    }, [senderUID]);

    const loadChatHistory = useCallback(async (receiverUid: string) => {
        try {
            console.log('Fetching messages for:', receiverUid); // Debug log
            if (CometChat.MessagesRequestBuilder) {
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                    .setUID(receiverUid)
                    .setLimit(50)
                    .build();

                const previousMessages = await messagesRequest.fetchPrevious();
                console.log('Previous messages:', previousMessages); // Debug log
                setMessages(previousMessages.map(formatMessage));
                return previousMessages;
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setError('Failed to load chat history');
        }
    }, [CometChat?.MessagesRequestBuilder]);

    useEffect(() => {
        const fetchSenderUID = async () => {
            const res = await axios.get('/api/users/me');
            const uid = res.data.data.username;
            setSenderUID(uid);
            if (uid) {
                await initializeChat();
            }
            const fetchConversations = async () => {
                try {
                    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
                        .setLimit(30)
                        .build();

                    const fetchedConversations = await conversationsRequest.fetchNext();
                    const formattedConversations = fetchedConversations.map((conv: any) => {
                        const conversationWith = conv.getConversationWith();
                        const uid = 'uid' in conversationWith ? conversationWith.uid : '';
                        return {
                            uid,
                            name: conversationWith.getName(),
                            lastMessage: conv.getLastMessage()?.getText(),
                            timestamp: conv.getLastMessage()?.getSentAt()
                        };
                    });

                    setConversations(formattedConversations as Conversation[]);
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                    setError('Failed to fetch conversations');
                }
            };
            fetchConversations();
        };
        if (typeof window !== 'undefined') {
            fetchSenderUID();
        }
    }, [CometChat.ConversationsRequestBuilder, initializeChat]);

    useEffect(() => {
        if (reciever) {
            setRecieverUID(reciever);
            setSelectedChat(reciever);
            loadChatHistory(reciever);
        }
    }, [reciever, loadChatHistory]);

    const startChat = async (receiverUid: string) => {
        try {
            router.push(`/onechat?reciever=${receiverUid}`);
            setSelectedChat(receiverUid);
            setRecieverUID(receiverUid);
            await loadChatHistory(receiverUid);
            console.log('Loading chat history for:', receiverUid);
        } catch (error) {
            console.error('Error starting chat:', error);
            setError('Failed to start chat');
        }
    };

    // Format message object
    const formatMessage = (message: any): Message => {
        return {
            id: message.getId(),
            text: message.getText(),
            sender: {
                uid: message.getSender().getUid(),
                name: message.getSender().getName(),
            },
            sentAt: message.getSentAt(),
        };
    };

    // Send message
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !senderUID) return;

        try {
            const textMessage = new CometChat.TextMessage(
                recieverUID,
                newMessage.trim(),
                CometChat.RECEIVER_TYPE.USER
            );

            const sentMessage = await CometChat.sendMessage(textMessage);
            setMessages(prev => [...prev, formatMessage(sentMessage)]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">Loading chats...</div>;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                {error}
            </div>
        );
    }
    if(conversations.length === 0){
        <h2 className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">No Recent Chat</h2>

    }

    return (
        <div className="h-[100vh] flex flex-col border rounded-md">
            {!selectedChat ? (
            <ConversationsList conversations={conversations} startChat={startChat} />
        ) : (
            <Chat senderUID={senderUID} recieverUID={recieverUID} setSelectedChat={setSelectedChat}/>
        )}
        </div>
    );
};

export default OneChat;