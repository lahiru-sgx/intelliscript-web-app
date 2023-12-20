import React from 'react';

interface ChatViewProps {
  messages: { role: 'user' | 'system'; content: string }[];
}

const ChatView: React.FC<ChatViewProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className={`mb-2 ${message.role === 'user' ? 'bg-yellow-300 text-black' : 'bg-green-300 text-black'}`} style={{ borderRadius: '10px', padding: '8px', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', wordWrap: 'break-word' }}>
          {message.content}
        </div>
      ))}
    </div>
  );
};

export default ChatView;




