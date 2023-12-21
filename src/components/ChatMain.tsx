import React, {useState, useEffect} from 'react';
import ChatBubble from './ChatBubble';
import ChatHistory from './ChatHistory';

const InferenceApiUrl = 'http://127.0.0.1:8888/api/inference';
const HistoryApiUrl = 'http://127.0.0.1:8888/api/history';

interface ChatMessage {
  role: 'user' | 'system';
  content: string;
}

interface History {
  id: number;
  messages: ChatMessage[];
}


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [showFeatures, setShowFeatures] = useState<boolean>(true);
  const [chatHistoryIds, setChatHistoryIds] = useState<Array<number>>([]);
  const [currentChatId, setCurrentChatId] = useState<number>();

  useEffect(() => {
    fetchChatHistoryIds();
  }, []);

  const handleSendMessage = async () => {
    if (currentMessage.trim().length > 0) {
      const newMessage: ChatMessage = {
        role: 'user',
        content: currentMessage,
      };

      setMessages((ps) => [...ps, newMessage]);

      const chatId = currentChatId ? currentChatId : new Date().valueOf()

      await saveMessages({
        id: chatId,
        messages: [newMessage],
      }).then(() => {
        if (!currentChatId) {
          fetchChatHistoryIds()
        }
      });
      setCurrentChatId(chatId);

      setCurrentMessage('');
      setShowFeatures(false);
      const systemReply = await sendMessageToSystem([newMessage]);
      const systemMessage: ChatMessage = {
        role: "system",
        content: systemReply
      }
      setMessages((ps) => [...ps, systemMessage]);
      saveMessages({
        id: chatId,
        messages: [systemMessage]
      })
    }
  };

  const sendMessageToSystem = async (userMessages: ChatMessage[]) => {
    try {
      const response = await fetch(`${InferenceApiUrl}/infer`, {
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
        return data.content;
      } else {
        console.error('Failed to send message to system');
      }
    } catch (error) {
      console.error('Error sending message to system', error);
    }
  };

  const saveMessages = async (chatHistory: History) => {
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

  const handleAddNewChatHistory = () => {
    setCurrentChatId(undefined);
    setMessages([]);
    setShowFeatures(true);
  };

  const handleSwitchChat = async (chatId: number) => {
    setCurrentChatId(chatId);
    fetchChatHistory(chatId);
  }

  const fetchChatHistory = async (chat_id: number) => {
    // Fetch the updated chat history from the backend
    try {
      const response = await fetch(`${HistoryApiUrl}/chat_history/${chat_id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch chat history from the backend');
      }
    } catch (error) {
      console.error('Error fetching chat history from the backend', error);
    }
  };

  const fetchChatHistoryIds = async () => {
    // Fetch the updated chat history from the backend
    try {
      const response = await fetch(`${HistoryApiUrl}/chat_history_ids`);
      if (response.ok) {
        const data = await response.json();
        setChatHistoryIds(data);
      } else {
        console.error('Failed to fetch chat history from the backend');
      }
    } catch (error) {
      console.error('Error fetching chat history from the backend', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Top Stripe */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="/path/to/intelliscript-logo.png" alt="Intelliscript Logo" className="mr-2"/>
          <span className="text-lg font-semibold">Intelliscript</span>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="p-2 border rounded-l-md"
            placeholder="Search in Chat..."
            style={{height: '32px'}}
            maxLength={200}
          />
          <button className="bg-blue-500 text-white p-2 rounded-r-md" style={{padding: '4px 12px'}}>Search</button>
        </div>
      </div>
      {/* Bottom Stripe */}
      <div className="flex flex-1">
        {/* Left Side */}
        <div className="w-1/4 bg-white rounded-lg p-4 mr-4 overflow-y-auto">
          <div className="mb-4">
            <button onClick={handleAddNewChatHistory} className="bg-blue-500 text-white p-2 rounded-md mr-2">+ New
              Chat
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-2">Chat History</h2>
          <ChatHistory
            chatSummaries={chatHistoryIds.map(id => ({id}))}
            onSelectChat={handleSwitchChat}
            currentChatId={currentChatId}
          />
          {/* User Details */}
          <div className="mb-4">
            <div className="text-sm">Username: Udith Weerasinghe</div>
            <div className="text-sm">Email: udithw@syntaxgenie.com</div>
          </div>
        </div>
        {/* Right Side */}
        <div
          className="flex-1 min-w-0 bg-white rounded-lg p-4 overflow-y-auto relative style={{ overflowWrap: 'break-word' }}">
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
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                    e.preventDefault(); // Prevent the default behavior of the Enter key
                  }
                }}
                className="fixed bottom-4 flex-1 p-2 border rounded-l-md"
                placeholder="Type a message..."
                style={{width: '70%'}}
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