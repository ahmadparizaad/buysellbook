'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cometchatAuth } from '@/utils/cometchatAuth';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const reciever = searchParams.get('reciever');
    const router = useRouter();
    const messageContainerRef = useRef<HTMLDivElement>(null);


    let CometChat: any;
    if (typeof window !== "undefined") {
        CometChat = require("@cometchat/chat-sdk-javascript").CometChat;
        window.CometChat = CometChat;
    }

    // Initialize chat and fetch previous messages  
    const initializeChat = useCallback(async () => {
        if (!senderUID) {
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            await cometchatAuth.init();
            const login = await cometchatAuth.login(senderUID);
            setIsLoading(false);
        } catch (error) {
            console.error('Error initializing chat:', error);
            setError('Failed to initialize chat');
        }
    }, [senderUID]);

    const scrollToBottom = () => {
        messageContainerRef.current?.scrollTo({
            top: messageContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const loadChatHistory = useCallback(async (receiverUid: string) => {
        try {
            setLoading(true)
            if (CometChat.MessagesRequestBuilder) {
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                    .setUID(receiverUid)
                    .setLimit(50)
                    .build();

                const previousMessages = await messagesRequest.fetchPrevious();
                setMessages(previousMessages.map(formatMessage));
                return previousMessages;
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setError('Failed to load chat history');
        } finally {
            setLoading(false)
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
            scrollToBottom()
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
            scrollToBottom()
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. Please try again.');
        }
    };

    if(loading){
        return <div className="animate-pulse">
        <div className="p-4 mt-20 border-b bg-gray-800 flex justify-between items-center">
          <div className="h-6 bg-gray-500 rounded-xl w-1/2"></div>
          <div className="h-6 bg-gray-500 rounded-xl w-1/6"></div>
        </div>
      
        <div className="message-container flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-end">
            <div className="flex justify-between max-w-[80%] rounded-2xl pl-4 pr-3 py-1 bg-blue-600 text-white">
              <div className="h-4 bg-blue-500 rounded w-3/4"></div>
              <div className="text-[8px] opacity-55 mt-3 h-4 bg-blue-500 rounded w-1/4">
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="flex justify-between max-w-[80%] rounded-2xl pl-4 pr-3 py-1 bg-gray-800">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="text-[8px] opacity-55 mt-3 h-4 bg-gray-300 rounded w-1/4">
              </div>
            </div>
          </div>     
        </div>
      
        <form className="p-4">
          <div className="flex space-x-2">
            <div className="flex-1 p-2 border rounded-3xl pl-4 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-6 bg-blue-200"></div>
            <div className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed h-6 w-1/4"></div>
          </div>
        </form>
      
        <div className="text-blue-500 h-6 rounded-3xl bg-blue-200 w-1/2"></div>
      </div>
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                {error}
            </div>
        );
    }
    if(conversations.length === 0){
        <h2 className="text-xl font-medium mb-4 mx-3 mt-20 md:mt-56 text-center">No Recent Chat</h2>
    }

    return (
        <div className="h-[100vh] flex flex-col border rounded-md font-[Gilroy]">
            {!selectedChat ? (
            <div className="flex-1 overflow-y-auto p-4">
            
            <h2 className="text-xl font-medium mb-4 mx-3 mt-20 md:mt-24">Recent Chats</h2>
            
            {isLoading && 
            <div className="animate-pulse mt-5 flex flex-col items-start gap-4 w-full shadow-md rounded-md p-4">

            <div className="h-20 bg-slate-500 w-full rounded-md"></div>
            <div className="h-20 bg-slate-500 w-full rounded-md"></div>
            <div className="h-20 bg-slate-500 w-full rounded-md"></div>
            <div className="h-20 bg-slate-500 w-full rounded-md"></div>
            <div className="h-20 bg-slate-500 w-full rounded-md"></div>
            </div>
            }

            {conversations.map((conversation) => (
                <div
                    key={conversation.uid}
                    className="border-b rounded-xl p-5 hover:bg-blue-100 cursor-pointer"
                    onClick={() => startChat(conversation.uid)}
                >
                    <div className="font-medium text-gray-600">{conversation.name || conversation.uid}</div>
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
        ) : (
            <>
            <div className="p-4 mt-24 border-b text-white bg-gray-800 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Chat with {recieverUID}</h2>
                <button 
                onClick={() => {
                  setSelectedChat(null)
                  router.push('/onechat')
                }}
                className="font-medium text-sm hover:text-blue-600"
              >
                ← Back
              </button>
            </div>

            {/* Messages Container */}
            <div
                ref={messageContainerRef}
                className="message-container flex-1 overflow-y-auto p-4 space-y-4"
            >
                
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender.uid === senderUID ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex justify-between max-w-[80%] rounded-2xl pl-4 pr-3 py-1 ${
                                message.sender.uid === senderUID
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-500 text-white'
                            }`}
                        >
                            <p className='mr-3'>{message.text}</p>
                            <span className="text-[8px] opacity-55 mt-3">
                                {new Date(message.sentAt * 1000).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-700 rounded-3xl pl-4 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-5 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </form>

            {error && <div className="text-red-500">{error}</div>}
            </>
        )}
        </div>
    );
};

export default OneChat;