// src/components/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showFeatures, setShowFeatures] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
      setShowFeatures(false);
    }
  };

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
          />
          <button className="bg-blue-500 text-white p-2 rounded-r-md">Search</button>
        </div>
      </div>

      {/* Bottom Stripe */}
      <div className="flex flex-1">
        {/* Left Side */}
        <div className="w-1/4 bg-white rounded-lg p-4 mr-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Chat History</h2>
          {/* Display chat history here */}
          {Array.from({ length: 20 }, (_, index) => (
            <div key={index} className="mb-4">Chat {index + 1}</div>
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
            <div key={index} className="mb-2">
              {message}
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

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

