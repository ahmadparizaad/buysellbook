'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { cometchatAuth } from '@/utils/cometchatAuth';

interface Message {
    id: string;
    text: string;
    sender: {
      uid: string;
      name: string;
    };
    sentAt: number;
  }

function Chat({params}: any) {

//     // // const [messages, setMessages] = useState<Message[]>([]);
//     // // const [newMessage, setNewMessage] = useState('');
//     // // const [senderUID, setSenderUID] = useState('');
//     // // const [recieverUID, setRecieverUID] = useState(''); 
//     // // const [isLoading, setIsLoading] = useState(true);
//     // // const [error, setError] = useState<string | null>(null);
//     // // const [userScrolled, setUserScrolled] = useState<boolean>(false); // Track if user has scrolled manually
    
//     // // const router = useRouter();
//     // // const messageContainerRef = useRef<HTMLDivElement>(null);
//     // // const headerRef = useRef<HTMLDivElement>(null);
//     // // console.log(params);
    
//     // // setRecieverUID(params.reciever);

//     // // let CometChat: any;
//     // // if (typeof window !== "undefined") {
//     // // CometChat = require("@cometchat/chat-sdk-javascript").CometChat;
//     // // window.CometChat = CometChat;
//     // // }

//     // // const loadChatHistory = useCallback(async (receiverUid: string) => {
//     // //     try {
//     // //         setIsLoading(true);
//     // //         console.log('Fetching messages for:', receiverUid); // Debug log
//     // //         if (CometChat.MessagesRequestBuilder) {
//     // //         const messagesRequest = new CometChat.MessagesRequestBuilder()
//     // //             .setUID(receiverUid)
//     // //             .setLimit(50)
//     // //             .build();
        
//     // //         const previousMessages = await messagesRequest.fetchPrevious();
//     // //         console.log('Previous messages:', previousMessages); // Debug log
//     // //         setMessages(previousMessages.map(formatMessage));
//     // //         return previousMessages;
//     // //         }
//     // //     } catch (error) {
//     // //       console.error('Error loading chat history:', error);
//     // //       setError('Failed to load chat history');
//     // //     } finally {
//     // //         setIsLoading(false);
//     // //     }
//     // //   }, [CometChat?.MessagesRequestBuilder]);

//     // // // Set up real-time message listener
//     // // useEffect(() => {
//     // //     const listenerId = "OneToOneChatListener";
    
//     // //     const messageListener = new CometChat.MessageListener({
//     // //       onTextMessageReceived: (message: any) => {
//     // //         // Only add message if it's from the current chat
//     // //         if (message.getSender().getUid() === recieverUID) {
//     // //           setMessages(prev => [...prev, formatMessage(message)]);
//     // //         }
//     // //       },
//     // //     });
    
//     // //     CometChat.addMessageListener(listenerId, messageListener);

//     // //     if (recieverUID) {
//     // //         const pMessages = loadChatHistory(recieverUID);
//     // //         if (!pMessages) {
//     // //           setNewMessage("Hi! I'm interested in buying your book.");
//     // //         }
//     // //       }
    
//     //     // Cleanup
//     //     return () => {
//     //       CometChat.removeMessageListener(listenerId);
//     //     };
//     //   }, [recieverUID, senderUID, loadChatHistory, CometChat]);
  
//     // //Send Message
//     // const sendMessage = async (e: React.FormEvent) => {
//     //     e.preventDefault();
        
//     //     if (!newMessage.trim() || !senderUID) return;
    
//         try {
//           const textMessage = new CometChat.TextMessage(
//             recieverUID,
//             newMessage.trim(),
//             CometChat.RECEIVER_TYPE.USER
//           );
    
//           const sentMessage = await CometChat.sendMessage(textMessage);
//           setMessages(prev => [...prev, formatMessage(sentMessage)]);
//           setNewMessage('');
//           scrollToBottom();
//         } catch (err) {
//           console.error('Error sending message:', err);
//           setError('Failed to send message. Please try again.');
//         }
//       };

//       //Format message
//     const formatMessage = (message: any): Message => {
//     return {
//         id: message.getId(),
//         text: message.getText(),
//         sender: {
//         uid: message.getSender().getUid(),
//         name: message.getSender().getName(),
//         },
//         sentAt: message.getSentAt(),
//     };
//     };

//     //Scroll to bottom
//    const scrollToBottom = () => {
//     messageContainerRef.current?.scrollTo({
//       top: messageContainerRef.current?.scrollHeight,
//       behavior: 'smooth'  // This adds the smooth animation
//     });
//   };

//   if(isLoading) {
//     return <div>Loading...</div>
//   }
  
  return (
    <div className="h-[100vh] flex flex-col border rounded-md">
          <div
          className="p-4 mt-20 border-b bg-gray-800 flex justify-between items-center">
            <h2 className="font-semibold">Chat with {params.receiverUid}</h2>
              {/* <button 
                onClick={() => {
                  setSelectedChat(null)
                  router.replace('/onechat')
                }}
                className="font-semibold text-sm hover:text-blue-600"
              >
                ← Back
              </button> */}
          
          </div>

    {/* Messages Container */}
    {/* <div
      ref={messageContainerRef}
      className="message-container flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender.uid === senderUID ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex justify-between max-w-[80%] rounded-2xl pl-4 pr-3 py-1 ${
              message.sender.uid === senderUID
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800'
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
    {/* <form onSubmit={sendMessage} className="p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-3xl pl-4 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form> */}
    </div>
  )
}

export default Chat