import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, ActionButton } from '../types';
import { Bot, ExternalLink, ArrowRight } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onActionClick: (value: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick }) => {
  const isUser = message.sender === 'user';
  
  // Ocean Blue Care Theme Bubbles
  const bubbleClass = isUser
    ? 'bg-[#EEF3F7] text-[#1D2D3A] rounded-2xl rounded-tr-sm shadow-sm border border-[#C9D9E6]/60'
    : 'bg-[#F1F8FF] text-[#1D2D3A] border border-[#C9D9E6]/60 rounded-2xl rounded-tl-sm shadow-sm';

  return (
    <div className={`group flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar - Top aligned with the message bubble */}
        {!isUser && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8F3FB] border border-[#2A7FBA]/20 flex items-center justify-center self-start mt-1.5 shadow-sm text-[#2A7FBA]">
              <Bot size={16} />
            </div>
        )}
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          <span className={`text-[10px] text-[#6C7B8A] mb-1 px-1 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? 'You' : 'Daisy AI'}
          </span>

          <div className={`px-5 py-3.5 text-sm leading-relaxed overflow-hidden ${bubbleClass}`}>
            <ReactMarkdown 
              components={{
                a: ({ node, ...props }) => <a {...props} className="underline decoration-[#2A7FBA]/50 underline-offset-2 text-[#2A7FBA] hover:text-[#1E6FA6] transition-colors font-medium" target="_blank" rel="noopener noreferrer" />,
                p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-4 mb-2 space-y-1 text-[#1D2D3A]" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-4 mb-2 space-y-1 text-[#1D2D3A]" />,
                strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-[#1D2D3A]" />
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Action Buttons (Only for Bot) */}
          {!isUser && message.buttons && message.buttons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 ml-1">
              {message.buttons.map((btn, idx) => (
                <ActionBtn key={idx} button={btn} onClick={onActionClick} />
              ))}
            </div>
          )}
          
          {/* Timestamp - visible on hover */}
          <span className="text-[10px] text-[#6C7B8A]/70 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </div>
    </div>
  );
};

// Sub-component for buttons - Pill Shaped, Blue Theme
const ActionBtn: React.FC<{ button: ActionButton; onClick: (val: string) => void }> = ({ button, onClick }) => {
  if (button.type === 'link' && button.url) {
    return (
      <a 
        href={button.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#2A7FBA] text-[#2A7FBA] hover:text-white text-xs font-semibold rounded-full border border-[#2A7FBA] transition-all hover:shadow-md hover:shadow-[#2A7FBA]/20"
      >
        {button.label}
        <ExternalLink size={12} />
      </a>
    );
  }

  return (
    <button
      onClick={() => onClick(button.value || button.label)}
      className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#2A7FBA] text-[#2A7FBA] hover:text-white border border-[#2A7FBA] text-xs font-semibold rounded-full transition-all hover:shadow-md hover:shadow-[#2A7FBA]/20 active:scale-95"
    >
      {button.label}
      <ArrowRight size={12} className="opacity-70" />
    </button>
  );
};