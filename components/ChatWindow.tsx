import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Trash2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message, ActionButton, WebhookResponse } from '../types';
import { getOrCreateSessionId } from '../utils/session';
import { sendMessageToWebhook } from '../services/chatService';

// Configuration for Weston/Aventura Endo Care
const CONFIG = {
  webhookUrl: 'https://n8n.srv1158432.hstgr.cloud/webhook/d912a276-534e-4ac0-9b59-458fbc389ca9',
  welcomeText: "Hello, this is Daisy from Weston/Aventura Endodontic Care, how can I help you today?",
  welcomeButtons: [
    { label: "Ask a Question", value: "Ask a Question", type: 'action' },
    { label: "Book an Appointment", value: "Book an Appointment", type: 'action' },
    { label: "Contact Me", value: "Contact Me", type: 'action' },
    { label: "Reschedule an Appointment", value: "Reschedule an Appointment", type: 'action' }
  ] as ActionButton[],
  placeholder: "Write a message...",
  poweredBy: "Powered by Weston/Aventura Endo Care",
  connectionError: "I'm having trouble connecting to the network. Please check your connection and try again."
};

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sessionId = useRef(getOrCreateSessionId()).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            text: CONFIG.welcomeText,
            sender: 'bot',
            timestamp: new Date(),
            buttons: CONFIG.welcomeButtons
          }
        ]);
      }, 500);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToWebhook(text, sessionId, CONFIG.webhookUrl);
      processResponse(response);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString() + '-err',
        text: CONFIG.connectionError,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const processResponse = (data: WebhookResponse) => {
    let botText = data.output || data.text || data.message || "I didn't understand that.";
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      botText = first.output || first.text || first.message || JSON.stringify(first);
    } else if (typeof data === 'string') {
        botText = data;
    }

    const botButtons: ActionButton[] = data.buttons || [];

    // Intelligent Button Injection
    // If no buttons are provided by the webhook, we scan the text for keywords
    // and automatically append the relevant buttons to improve user experience.
    if (botButtons.length === 0) {
      const lowerText = botText.toLowerCase();

      // Check for 'Book Appointment' related context
      if (lowerText.includes('book appointment') || lowerText.includes('book an appointment') || lowerText.includes('schedule your appointment')) {
        botButtons.push({ label: "Book an Appointment", value: "Book an Appointment", type: 'action' });
      }

      // Check for 'Contact Me' related context
      if (lowerText.includes('contact me') || lowerText.includes('contact us') || lowerText.includes('reach out')) {
         botButtons.push({ label: "Contact Me", value: "Contact Me", type: 'action' });
      }

      // Check for 'Reschedule' related context
      if (lowerText.includes('reschedule')) {
         botButtons.push({ label: "Reschedule an Appointment", value: "Reschedule an Appointment", type: 'action' });
      }
    }

    const botMsg: Message = {
      id: Date.now().toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
      buttons: botButtons,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F7FAFD] text-[#1D2D3A]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-white border-b border-[#C9D9E6]/50 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-[#E8F3FB] rounded-2xl flex items-center justify-center shadow-inner">
              <MessageSquare size={24} className="text-[#2A7FBA] fill-current" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-3 h-3 bg-[#2A7FBA] rounded-full border border-white"></div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#1D2D3A] tracking-tight leading-snug">Weston/Aventura<br className="sm:hidden" /> Endo Care</h3>
            <p className="text-sm text-[#6C7B8A] font-medium">Daisy</p>
          </div>
        </div>
        
        {/* Actions */}
        <button 
             onClick={handleClear} 
             className="group flex items-center gap-2 px-4 py-2 text-[#6C7B8A] hover:text-[#2A7FBA] hover:bg-[#E8F3FB] rounded-full transition-all duration-200"
             title="Restart Conversation"
           >
            <span className="text-xs font-semibold hidden sm:block uppercase tracking-wider">Restart</span>
            <Trash2 size={20} />
        </button>
      </div>

      {/* Messages Area - Constrained width for readability on large screens */}
      <div className="flex-1 overflow-y-auto bg-[#F7FAFD] scrollbar-thin">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col space-y-8">
           
           {messages.map((msg) => (
             <ChatMessage 
                key={msg.id} 
                message={msg} 
                onActionClick={(val) => handleSend(val)}
             />
           ))}

           {isLoading && (
             <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-end gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#E8F3FB] flex items-center justify-center mb-1 border border-[#2A7FBA]/20 shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-[#2A7FBA]/20" />
                 </div>
                 <TypingIndicator />
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#C9D9E6]/50 p-4 sm:p-6">
        <div className="w-full max-w-4xl mx-auto">
            <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-end gap-3"
            >
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={CONFIG.placeholder}
                className="w-full bg-[#EEF2F6] text-[#1D2D3A] placeholder-[#6C7B8A] border border-[#CBD5E1] focus:bg-white focus:border-[#2A7FBA] rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-4 focus:ring-[#2A7FBA]/10 transition-all text-base shadow-inner"
            />
            <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className={`
                    absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200
                    ${input.trim() && !isLoading
                        ? 'bg-[#2A7FBA] hover:bg-[#1E6FA6] text-white shadow-md shadow-[#2A7FBA]/20 scale-100' 
                        : 'bg-transparent text-[#C9D9E6] cursor-not-allowed scale-95'
                    }
                `}
            >
                <Send size={20} />
            </button>
            </form>
            <div className="flex justify-center mt-4">
                <span className="text-xs text-[#6C7B8A] opacity-60 font-medium tracking-wide">
                    {CONFIG.poweredBy}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};