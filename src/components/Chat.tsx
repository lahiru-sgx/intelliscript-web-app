
// src/components/Chat.tsx
import React, { useState, useEffect,useCallback } from 'react';

const apiUrl = 'http://127.0.0.1:8000';

interface ChatMessage {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showFeatures, setShowFeatures] = useState<boolean>(true);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      await sendMessageToChatbot(newMessage);

      //await fetchGreetMessage();
      setNewMessage('');
      setShowFeatures(false);
    }
  };

  const sendMessageToChatbot = async (message: string) => {
    try {
      if (message) {
        setMessages((prevMessages) => [...prevMessages,{role :"user", content : message}]);
        
      }
      const response = await fetch(`${apiUrl}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reversedMessages = data.messages[0]?.content;

      if (reversedMessages) {
        // Add reversed messages to the state
        setMessages((prevMessages) => [...prevMessages, reversedMessages]);
      }

      } else {
        console.error('Failed to send message to chatbot');
      }
    } catch (error) {
      console.error('Error sending message to chatbot', error);
    }
  };

  const fetchGreetMessage = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/greet`);
  
      if (response.ok) {
        const data = await response.json();
        
        // Check if greet message already exists in messages
        const greetMessageExists = messages.some(
          (message) => message.role === 'chatbot' && message.content === data.message
        );
  
        if (!greetMessageExists) {
          // Filter out existing greet messages and add the new one
          setMessages((prevMessages) => [
            ...prevMessages.filter((message) => message.role !== 'chatbot'),
            { role: 'chatbot', content: data.message },
          ]);
        }
      } else {
        console.error('Failed to fetch chat messages');
      }
    } catch (error) {
      console.error('Error fetching chat messages', error);
    }
  }, [messages]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchGreetMessage();
    };
    fetchData();
  }, [fetchGreetMessage]);
  
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
            <button className="bg-blue-500 text-white p-2 rounded-md mr-2">+ New Chat</button>
          </div>
          <h2 className="text-lg font-semibold mb-2">Chat History</h2>
          {/* Display chat history here */}
          {Array.from({ length: 20 }, (_, index) => (
            <div
              key={index}
              //className={`mb-4 transition-opacity duration-300 ${index >= visibleChats ? 'opacity-0' : 'opacity-100'}`}
            >
              Chat {index + 1}
            </div>
          ))}
          <div className="fixed bottom-4">
            {/* User Details */}
            <div>Username: Udith Weerasinghe</div>
            <div>Email: udithw@syntaxgenie.com</div>
          </div>
        </div>
            {/* Right Side */}
        <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto relative ">
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
          <div
            key={index}
            className={`mb-2 ${
              message.role === 'user' ? 'bg-yellow-300 text-black' : 'bg-green-300 text-black'
            }`}
            style={{
              borderRadius: '10px',
              padding: '8px',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.role === 'chatbot' ? (
              typeof message === 'string'
                ? message // Plain string
                : message.content // Extract original user message
            ) : (
              typeof message === 'string'
                ? message // Plain string
                : message.content // Extract reversed text
            )}
          </div>
        ))}



          {/* Message Input */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex items-center justify-end p-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="fixed bottom-4 flex-1 p-2 border rounded-l-md"
                placeholder="Type a message..."
                style={{ width: '70%' }} 
              />
              <button
                onClick={handleSendMessage}
                className="fixed bottom-4 bg-blue-500 text-white p-2 rounded-r-md ml-50"
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



