import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateChatResponse } from '../services/geminiService';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export const ChatBot: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Initial message effect
  useEffect(() => {
    setMessages([
        { id: 1, text: t('chat.welcome'), sender: 'bot' }
    ]);
  }, [t]); // Re-run when language changes

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    try {
        // Call Gemini API
        const responseText = await generateChatResponse(messages, userText, language);
        
        const botResponse: Message = {
            id: Date.now() + 1,
            text: responseText,
            sender: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
    } catch (error) {
        console.error("Failed to get response", error);
        const errorResponse: Message = {
            id: Date.now() + 1,
            text: "Sorry, I'm having trouble connecting right now.",
            sender: 'bot'
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isOpen 
            ? 'bg-theme-surface text-theme-text-primary border border-theme-border rotate-90' 
            : 'bg-indigo-600 text-white'
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-8 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-theme-surface border border-theme-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
             </div>
             <div>
               <h3 className="font-bold text-white text-sm">{t('chat.header')}</h3>
               <div className="flex items-center mt-0.5">
                 <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                 <span className="text-indigo-100 text-xs">{t('chat.status')}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-theme-surface/95 custom-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div 
                 className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                   msg.sender === 'user' 
                     ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' 
                     : 'bg-theme-secondary text-theme-text-primary border border-theme-border rounded-bl-none'
                 }`}
               >
                 {msg.text}
               </div>
             </div>
           ))}
           
           {/* Typing Indicator */}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-theme-secondary p-3 rounded-2xl rounded-bl-none border border-theme-border flex space-x-1">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
           )}
           
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-theme-surface border-t border-theme-border flex items-center gap-2">
           <input
             type="text"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder={t('chat.placeholder')}
             disabled={isTyping}
             className="flex-1 bg-theme-input border border-theme-border rounded-full px-4 py-2.5 text-sm text-theme-text-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-theme-text-muted disabled:opacity-50"
           />
           <button 
             type="submit" 
             className={`p-2.5 rounded-full text-white transition-all duration-200 flex items-center justify-center ${
                inputText.trim() && !isTyping
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transform hover:scale-105' 
                  : 'bg-theme-secondary text-theme-text-muted cursor-not-allowed'
             }`}
             disabled={!inputText.trim() || isTyping}
             aria-label="Send message"
           >
             <Send className="w-4 h-4" />
           </button>
        </form>
      </div>
    </>
  );
};