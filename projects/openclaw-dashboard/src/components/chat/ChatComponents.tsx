import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Code block component
function CodeBlock({ inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden bg-slate-900">
      {!inline && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs text-slate-400">{language}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? '✓ 已复制' : '复制'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300">
        <code {...props}>{children}</code>
      </pre>
    </div>
  );
}

// Link component
function LinkComponent({ ...props }: any) {
  return (
    <a
      {...props}
      className="text-blue-400 hover:text-blue-300 underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    />
  );
}

// Paragraph component
function ParagraphComponent({ children }: any) {
  return <p className="mb-2 last:mb-0 text-slate-200">{children}</p>;
}

// List components
function OrderedListComponent({ children }: any) {
  return <ol className="list-decimal pl-6 mb-2 text-slate-200">{children}</ol>;
}

function UnorderedListComponent({ children }: any) {
  return <ul className="list-disc pl-6 mb-2 text-slate-200">{children}</ul>;
}

function ListItemComponent({ children }: any) {
  return <li className="mb-1 text-slate-200">{children}</li>;
}

// Text formatting
function BoldComponent({ children }: any) {
  return <strong className="font-semibold text-white">{children}</strong>;
}

function EmphasisComponent({ children }: any) {
  return <em className="italic text-slate-300">{children}</em>;
}

// Heading components
function Heading1Component({ children }: any) {
  return <h1 className="text-2xl font-bold text-white mb-3 mt-4">{children}</h1>;
}

function Heading2Component({ children }: any) {
  return <h2 className="text-xl font-bold text-white mb-2 mt-3">{children}</h2>;
}

function Heading3Component({ children }: any) {
  return <h3 className="text-lg font-bold text-white mb-2 mt-2">{children}</h3>;
}

// Blockquote
function BlockquoteComponent({ children }: any) {
  return (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-slate-700/50 text-slate-300">
      {children}
    </blockquote>
  );
}

// Message bubble component - 支持显示 Agent 信息
export function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user';
  const isSystem = message.agentId === 'system';

  // 获取 Agent 信息
  const agentInfo = message.agentId && message.agentId !== 'system' && message.agentId !== 'user'
    ? AGENT_AVATARS[message.agentId] || { avatar: '🤖', name: 'AI' }
    : null;

  return (
    <div
      className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Agent 头像 */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-lg mr-3 mt-1">
          {isSystem ? (message.agentAvatar || '🔄') : (agentInfo?.avatar || message.agentAvatar || '🤖')}
        </div>
      )}

      {/* 消息内容 */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-md'
            : isSystem
            ? 'bg-amber-500/20 border border-amber-500/30 text-amber-200 rounded-bl-md'
            : 'bg-slate-700 border border-slate-600 text-slate-200 rounded-bl-md'
        }`}
      >
        {/* Agent 名称标签 */}
        {!isUser && agentInfo && (
          <div className="text-xs text-blue-400 mb-1 font-medium">
            {agentInfo.name}
          </div>
        )}
        {!isUser && isSystem && message.agentName && (
          <div className="text-xs text-amber-400 mb-1 font-medium">
            {message.agentName}
          </div>
        )}

        {/* 消息内容 */}
        <ReactMarkdown
          components={{
            code: CodeBlock,
            a: LinkComponent,
            p: ParagraphComponent,
            ol: OrderedListComponent,
            ul: UnorderedListComponent,
            li: ListItemComponent,
            strong: BoldComponent,
            em: EmphasisComponent,
            h1: Heading1Component,
            h2: Heading2Component,
            h3: Heading3Component,
            blockquote: BlockquoteComponent,
          }}
        >
          {message.content}
        </ReactMarkdown>

        {/* 时间戳 */}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-200 text-right' : 'text-slate-500'
          }`}
        >
          {message.timestamp?.toLocaleTimeString?.('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          }) || ''}
        </div>
      </div>

      {/* 用户头像 */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-lg ml-3 mt-1">
          👤
        </div>
      )}
    </div>
  );
}

// Agent 头像映射
const AGENT_AVATARS: Record<string, { avatar: string; name: string }> = {
  main: { avatar: '🤖', name: '渔晓白' },
  architect: { avatar: '🏗️', name: 'Morgan' },
  'backend-dev': { avatar: '💻', name: 'Ryan' },
  'frontend-dev': { avatar: '🎨', name: 'Chloe' },
  'database-engineer': { avatar: '💾', name: 'Diana' },
  'devops-engineer': { avatar: '🚀', name: 'Sam' },
  'security-engineer': { avatar: '🛡️', name: 'Sophia' },
  'test-engineer': { avatar: '✅', name: 'Taylor' },
  'code-reviewer': { avatar: '📝', name: 'Blake' },
  'ui-ux-designer': { avatar: '🖌️', name: 'Maya' },
  'product-manager': { avatar: '📋', name: 'Alex' },
  coordinator: { avatar: '🤝', name: 'Casey' },
};

// Typing indicator - 更流畅的动画
export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-3 py-2 bg-slate-700 rounded-full">
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// Message list component
export function MessageList({ 
  messages, 
  isTyping,
  messagesEndRef 
}: { 
  messages: any[]; 
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && (
        <div className="flex justify-start pl-11">
          <TypingIndicator />
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}

// Chat input component - 支持流畅输入
export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className={`flex items-end space-x-3 p-4 bg-slate-800 rounded-xl border transition-colors ${
      isFocused ? 'border-blue-500' : 'border-slate-700'
    }`}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none text-sm leading-relaxed"
          rows={1}
          style={{ minHeight: '24px', maxHeight: '150px' }}
          disabled={disabled}
        />
      </div>
      
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0 ${
          !value.trim() || disabled
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
        }`}
      >
        发送
      </button>
    </div>
  );
}