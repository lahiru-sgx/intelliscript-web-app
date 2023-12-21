// ChatHistory.tsx
import React from 'react';

interface ChatHistoryProps {
  chatHistories: { id: number; messages: { role: 'user' | 'system'; content: string }[] }[];
  onSelectChat: (chatId: number) => void;
  currentChatId: number | null;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistories, onSelectChat, currentChatId }) => {
  return (
    <div>
      
      {/* Display chat history here */}
      {chatHistories.map((chat) => (
        <div key={chat.id} onClick={() => onSelectChat(chat.id)} className={`cursor-pointer mb-2 ${currentChatId === chat.id ? 'text-blue-500' : ''}`}>
          Chat {chat.id}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;




