// ChatHistory.tsx
import React from 'react';

interface ChatHistoryProps {
  chatHistories: { id: number; messages: { role: 'user' | 'system'; content: string }[] }[];
  onSelectChat: (chatId: number) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistories, onSelectChat }) => {
  return (
    <div>
      
      {/* Display chat history here */}
      {chatHistories.map((chat) => (
        <div key={chat.id} onClick={() => onSelectChat(chat.id)} className="cursor-pointer mb-2">
          Chat {chat.id}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;




