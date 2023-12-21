// ChatHistory.tsx
import React from 'react';

interface ChatHistoryProps {
  chatSummaries: { id: number }[];
  onSelectChat: (chatId: number) => void;
  currentChatId?: number;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatSummaries, onSelectChat, currentChatId }) => {
  return (
    <div>
      
      {/* Display chat history here */}
      {chatSummaries.map((chat) => (
        <div key={chat.id} onClick={() => onSelectChat(chat.id)} className={`cursor-pointer mb-2 ${currentChatId === chat.id ? 'text-blue-500' : ''}`}>
          Chat {chat.id}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;




