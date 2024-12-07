// src/components/OneToOneChat.tsx
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { cometchatAuth } from '@/utils/cometchatAuth';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: {
    uid: string;
    name: string;
  };
  sentAt: number;
}
interface OneToOneChatProps {
  senderUID: string;
  receiverUID: string;
}

const OneToOneChat: React.FC<OneToOneChatProps> = ({ senderUID, receiverUID }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat and fetch previous messages
  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(senderUID);
      console.log(receiverUID);
      
      const login = await cometchatAuth.login(senderUID);
      console.log(login);

      // Fetch previous messages
      const messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(receiverUID)
        .setLimit(50)
        .build();

      const previousMessages = await messagesRequest.fetchPrevious();
      setMessages(previousMessages.map(formatMessage));

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing chat:', err);
      setError('Failed to initialize chat. Please try again.');
      setIsLoading(false);
    }
  }, [receiverUID, senderUID]);

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
        receiverUID,
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

    // Set up real-time message listener
    useEffect(() => {
      const listenerId = "OneToOneChatListener";
  
      const messageListener = new CometChat.MessageListener({
        onTextMessageReceived: (message: any) => {
          // Only add message if it's from the current chat
          if (message.getSender().getUid() === receiverUID) {
            setMessages(prev => [...prev, formatMessage(message)]);
          }
        },
      });
  
      CometChat.addMessageListener(listenerId, messageListener);
  
      // Initialize chat
      initializeChat();
  
      // Cleanup
      return () => {
        CometChat.removeMessageListener(listenerId);
      };
    }, [receiverUID, initializeChat]);
  
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">Loading chat...</div>;
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      );
    }
  

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
    {/* Chat Header */}
    <div className="p-4 border-b bg-gray-50">
      <h2 className="font-semibold">Chat with {receiverUID}</h2>
    </div>

    {/* Messages Container */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender.uid === senderUID ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender.uid === senderUID
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <p>{message.text}</p>
            <span className="text-xs opacity-75">
              {new Date(message.sentAt * 1000).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Message Input */}
    <form onSubmit={sendMessage} className="p-4 border-t">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  </div>
);
};

export default OneToOneChat;