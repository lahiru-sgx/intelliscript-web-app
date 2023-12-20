import React, { useState } from 'react';

interface ChatSearchProps {
  onSearch: (searchText: string) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = () => {
    // You can perform any search-related logic here
    onSearch(searchText);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="p-2 border rounded-l-md"
        placeholder="Search in Chat..."
        style={{ height: '32px' }}
        maxLength={200}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-r-md ml-2"
        style={{ padding: '4px 12px' }}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default ChatSearch;

