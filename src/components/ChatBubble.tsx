// Import React library
import React from 'react';

// Define the prop types for ChatBubble
interface ChatBubbleProps {
  role: 'user' | 'system';
  content: string;
  index : number;
}

// Functional component for displaying chat bubbles
const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, index }) => {
  const isUserMessage = role === 'user';
  return (
    <div className={`flex items-center mb-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-center mr-2">
        <div className={`bg-${isUserMessage ? 'yellow' : 'green'}-300 text-${isUserMessage ? 'blue' : 'black'} p-2 rounded-full`} style={{ minWidth: '30px', minHeight: '30px' }}>
        {`${isUserMessage ? 'U' : 'S'}${index}`}
        </div>
      </div>
      <div className={`bg-${isUserMessage ? 'yellow' : 'green'}-300 text-${isUserMessage ? 'blue' : 'black'} p-2 rounded-lg max-w-3/4 `} 
      style={{ borderRadius: isUserMessage ? '0 10px 10px 10px' : '10px 0 10px 10px', wordWrap: 'break-word', alignSelf: isUserMessage ? 'flex-end' : 'flex-start', padding: '8px',}}>
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
