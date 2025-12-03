import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 p-3 items-center bg-[#F1F8FF] rounded-2xl w-fit rounded-tl-none border border-[#C9D9E6] shadow-sm">
      <div className="w-1.5 h-1.5 bg-[#2A7FBA] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-[#2A7FBA] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-[#2A7FBA] rounded-full animate-bounce"></div>
    </div>
  );
};