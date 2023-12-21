// src/components/ChatMain.tsx
import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatHistory from './ChatHistory';

const InferenceApiUrl = 'http://127.0.0.1:8000';
const HistoryApiUrl = 'http://127.0.0.1:8888';

interface ChatMessage {
  role: 'user' | 'system';
  content: string;
  messageIndex : number;
}

interface History{
  id: number;
  messages: ChatMessage[];
}


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setcurrentMessage] = useState<string>('');
  const [showFeatures, setShowFeatures] = useState<boolean>(true);
  const [chatHistories, setChatHistories] = useState< History []>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== '') {
      const newMessage: ChatMessage = {
        role: 'user',
        content: currentMessage,
        messageIndex: messages.length + 1,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (currentChatId !== null) {
        // If there is an active chat, update its messages
        await updateChatHistory(currentChatId, [...messages, newMessage]);
      } else {
        // If there is no active chat, create a new chat
        const newChatHistory: History = {
          id: chatHistories.length + 1,
          messages: [...messages, newMessage],
        };

        await saveMessagesToBackend(newChatHistory);
        setChatHistories((prevChatHistories) => [...prevChatHistories, newChatHistory]);
        setCurrentChatId(newChatHistory.id);
      }

      setcurrentMessage('');
      setShowFeatures(false);
      await sendMessageToSystem([newMessage]);
    }
  };

  const sendMessageToSystem = async (userMessages: ChatMessage[]) => {
    try {
      const response = await fetch(`${InferenceApiUrl}/system`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: userMessages,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.messages) {
          // Update local state with system messages
          setMessages((prevMessages) => [...prevMessages, ...data.messages]);
          console.log('System response:', data.messages);
        }
      } else {
        console.error('Failed to send message to system');
      }
    } catch (error) {
      console.error('Error sending message to system', error);
    }
  };
  

  const saveMessagesToBackend = async (chatHistory: History) => {
    try {
      const response = await fetch(`${HistoryApiUrl}/save_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatHistory),
      });

      if (!response.ok) {
        console.error('Failed to save messages to the backend');
      }
    } catch (error) {
      console.error('Error saving messages to the backend', error);
    }
  };

  const fetchGreetMessage = async () => {
    try {
      const response = await fetch(`${InferenceApiUrl}/greet`);
  
      if (response.ok) {
        const data = await response.json();
        // Filter out existing greet messages and add the new one
        setMessages((prevMessages) => [
          ...prevMessages.filter((message) => message.role !== 'system'),
          { role: 'system', content: data.message, messageIndex: prevMessages.length },
        ]);
      } else {
        console.error('Failed to fetch greet messages');
      }
    } catch (error) {
      console.error('Error fetching greet messages', error);
    }
  } ;


  const handleAddNewChatHistory = () => {
    // Create a new chat history using the current conversation as initial messages
    const newChatHistory = {
      id: chatHistories.length + 1,
      messages: [...messages],
    };
    
    // Update the chat histories state
    setChatHistories((prevChatHistories) => [...prevChatHistories, newChatHistory]);
    setCurrentChatId(newChatHistory.id);

    // Start a new chat with an empty messages array
    setMessages([]);
    setShowFeatures(true);
  };

  const handleCreateNewChat = async (chatId: number) => {
    const chatHistory = chatHistories.find((chat) => chat.id === chatId);
  
    if (chatHistory) {
      // Fetch the updated chat history from the backend
      await fetchChatHistory();
  
      setMessages(chatHistory.messages);
      setShowFeatures(false);
    }
  };
  
  
  const updateChatHistory = async (chatId: number, messages: ChatMessage[]) => {
    try {
      const response = await fetch(`${HistoryApiUrl}/new_chat/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
        }),
      });

      if (!response.ok) {
        console.error('Failed to update chat on the backend');
      }
    } catch (error) {
      console.error('Error updating chat on the backend', error);
    }
  };
  
  const fetchChatHistory = async () => {
    // Fetch the updated chat history from the backend
    try {
      const response = await fetch(`${HistoryApiUrl}/chat_history`);
      if (response.ok) {
        const data = await response.json();
        setChatHistories(data.chat_history);
      } else {
        console.error('Failed to fetch chat history from the backend');
      }
    } catch (error) {
      console.error('Error fetching chat history from the backend', error);
    }
  };
  
  
  useEffect(() => {
    fetchGreetMessage();
  },[]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Top Stripe */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="/path/to/intelliscript-logo.png" alt="Intelliscript Logo" className="mr-2" />
          <span className="text-lg font-semibold">Intelliscript</span>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="p-2 border rounded-l-md"
            placeholder="Search in Chat..."
            style={{ height: '32px' }}
            maxLength={200}
          />
          <button className="bg-blue-500 text-white p-2 rounded-r-md"style={{ padding: '4px 12px' }}>Search</button>
        </div>
      </div>
      {/* Bottom Stripe */}
      <div className="flex flex-1">
        {/* Left Side */}
        <div className="w-1/4 bg-white rounded-lg p-4 mr-4 overflow-y-auto">
          <div className="mb-4">
            <button onClick={handleAddNewChatHistory} className="bg-blue-500 text-white p-2 rounded-md mr-2">+ New Chat</button>
          </div>
          <h2 className="text-lg font-semibold mb-2">Chat History</h2>
          <ChatHistory chatHistories={chatHistories} onSelectChat={handleCreateNewChat} currentChatId={currentChatId} />
        
            {/* User Details */}
            <div className="mb-4">
              <div className="text-sm">Username: Udith Weerasinghe</div>
              <div className="text-sm">Email: udithw@syntaxgenie.com</div>
            </div>
          </div>
            {/* Right Side */}
        <div className="flex-1 min-w-0 bg-white rounded-lg p-4 overflow-y-auto relative style={{ overflowWrap: 'break-word' }}">
          {showFeatures && (
            <div className="text-center text-gray-500 mb-4">
              Start Exploring Now !!!!
              <div>
                <button className="bg-blue-500 text-white p-2 rounded-md mr-2">Feature 1</button>
                <button className="bg-blue-500 text-white p-2 rounded-md mr-2">Feature 2</button>
                <button className="bg-blue-500 text-white p-2 rounded-md mr-2">Feature 3</button>
                <button className="bg-blue-500 text-white p-2 rounded-md ">Feature 4</button>
                {/* Add more feature buttons as needed */}
              </div>
            </div>
          )}
          {/* Display Messages */}
        {messages.map((message, index) => (
          <ChatBubble key={index} role={message.role} content={message.content} index={index + 1}/>
        ))}

          {/* Message Input */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex items-center justify-end p-2 h-full">
              <textarea
                value={currentMessage}
                onChange={(e) => setcurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                    e.preventDefault(); // Prevent the default behavior of the Enter key
                  }
                }}
                className="fixed bottom-4 flex-1 p-2 border rounded-l-md"
                placeholder="Type a message..."
                style={{ width: '70%' }} 
              />
              <button
                onClick={handleSendMessage}
                className="fixed bottom-4 bg-blue-500 text-white p-2 rounded-l-md rounded-r-md ml-2 h-10"
              >
                Send
              </button>
            </div>
          </div>

          <div/>
        </div>
      </div>
    </div>
  );
};

export default Chat;