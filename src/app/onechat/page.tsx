'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
// import { useInitializeCometChat } from '@/utils/cometchatConfig';
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

interface Conversation {
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
  const [userScrolled, setUserScrolled] = useState(false); // Track if user has scrolled manually

  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const reciever = searchParams.get('reciever');

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
    try{
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
        // console.log(`Sender UID: ${uid}`);
        if(senderUID){
        await initializeChat();
        }
        const fetchConversations = async () => {
          try {
            const conversationsRequest = new CometChat.ConversationsRequestBuilder()
              .setLimit(30)
              // .setConversationType('user')
              .build();
      
            const fetchedConversations = await conversationsRequest.fetchNext();
            const formattedConversations = fetchedConversations.map((conv: { getConversationWith: () => any; getLastMessage: () => { (): any; new(): any; getText: { (): any; new(): any; }; getSentAt: { (): any; new(): any; }; }; }) => {
              const conversationWith = conv.getConversationWith();
              const uid = 'uid' in conversationWith ? conversationWith.uid : '';
              console.log(uid);
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

    fetchSenderUID();
  }, [CometChat.ConversationsRequestBuilder, initializeChat]);

  useEffect(() => {
    if (reciever) {
      setRecieverUID(reciever);
      setSelectedChat(reciever);
      loadChatHistory(reciever);
    }
  }, [reciever, loadChatHistory]);

 

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      // Check if user has scrolled up
      if (scrollTop + clientHeight < scrollHeight) {
        setUserScrolled(true);
      } else {
        setUserScrolled(false);
      }
    }
  };

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  const startChat = async (receiverUid: string) => {
    try{
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

  const getSenderUID = async () => {
    const res = await axios.get('/api/users/me');
    const senderUID = res.data.data.username;
    setSenderUID(senderUID);
    console.log(`Sender UID: ${senderUID}`);
    return senderUID;
  }

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
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

   // Add this function to scroll to bottom
   const scrollToBottom = () => {
    messageContainerRef.current?.scrollTo({
      top: messageContainerRef.current?.scrollHeight,
      behavior: 'smooth'  // This adds the smooth animation
    });
  };

  const scrollToHeader = () => {
    headerRef.current?.scrollTo({
      top: headerRef.current?.scrollHeight,
      behavior: 'smooth'  // This adds the smooth animation
    });
  };

    // Add this to ensure receiver UID is set before loading messages
    useEffect(() => {
      if (selectedChat && recieverUID) {
        const pMessages = loadChatHistory(recieverUID);
        if (!pMessages) {
          setNewMessage("Hi! I'm interested in buying your book.");
        }
      }
    }, [selectedChat, userScrolled, recieverUID, loadChatHistory, reciever, messages]);

    // Set up real-time message listener
    useEffect(() => {
      const listenerId = "OneToOneChatListener";
  
      const messageListener = new CometChat.MessageListener({
        onTextMessageReceived: (message: any) => {
          // Only add message if it's from the current chat
          if (message.getSender().getUid() === recieverUID) {
            setMessages(prev => [...prev, formatMessage(message)]);
          }
        },
      });
  
      CometChat.addMessageListener(listenerId, messageListener);
  
      // Initialize chat
      if (senderUID) {
        initializeChat();
      }
  
      // Cleanup
      return () => {
        CometChat.removeMessageListener(listenerId);
      };
    }, [recieverUID, initializeChat, senderUID, CometChat]);

    // Scroll when messages change (new message sent or received)
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // Scroll when chat is loaded
  // useEffect(() => {
  //   if (selectedChat) {
  //     scrollToBottom();
  //   }
  // }, [selectedChat]);

    // if (conversations.length == 0) {
    //   return <div className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">No recent chats</div>;
    // }
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
  

  return (
    <div className="h-[100vh] flex flex-col border rounded-md">
    {!selectedChat ? (
        // Conversations List View
        <div className="flex-1 overflow-y-auto p-4">
          
          {conversations.length == 0 ? (
            <h2 className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">No Recent Chat</h2>          ) : (
            <>
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
            </>
          )}
          
        </div>
      ) : (
        // Individual Chat View
        <>
          <div
          ref={headerRef}
          className="p-4 mt-20 border-b bg-gray-800 flex justify-between items-center">
            <h2 className="font-semibold">Chat with {recieverUID}</h2>
              <button 
                onClick={() => {
                  setSelectedChat(null)
                  router.push('/onechat')
                }}
                className="font-semibold text-sm hover:text-blue-600"
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
    <form onSubmit={sendMessage} className="p-4">
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
    </form>
    </>
  )}
    </div>
);
};

export default OneChat;