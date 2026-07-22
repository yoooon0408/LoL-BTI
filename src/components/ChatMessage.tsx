'use client';

import type { Message } from '@/types';

interface Props {
  message: Message;
}

function renderContent(text: string): React.ReactNode {
  // **볼드** 텍스트 렌더링
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-lol-gold-light font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lol-navy border border-lol-gold-dim flex items-center justify-center mr-2 mt-1">
          <span className="text-lol-gold text-xs font-bold">AI</span>
        </div>
      )}

      <div
        className={`
          max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-lol-blue text-lol-text-bright rounded-br-sm'
            : 'bg-lol-navy-light text-lol-text rounded-bl-sm border border-lol-blue'
          }
        `}
      >
        {renderContent(message.content)}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lol-blue border border-lol-blue-light flex items-center justify-center ml-2 mt-1">
          <span className="text-lol-text-bright text-xs font-bold">나</span>
        </div>
      )}
    </div>
  );
}

export function StreamingMessage({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="flex w-full justify-start animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lol-navy border border-lol-gold-dim flex items-center justify-center mr-2 mt-1">
        <span className="text-lol-gold text-xs font-bold">AI</span>
      </div>
      <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap bg-lol-navy-light text-lol-text border border-lol-blue">
        {content}
        <span className="inline-block w-0.5 h-4 bg-lol-gold ml-0.5 animate-pulse align-text-bottom" />
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lol-navy border border-lol-gold-dim flex items-center justify-center mr-2 mt-1">
        <span className="text-lol-gold text-xs font-bold">AI</span>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-lol-navy-light border border-lol-blue flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-lol-gold" />
        <span className="typing-dot w-2 h-2 rounded-full bg-lol-gold" />
        <span className="typing-dot w-2 h-2 rounded-full bg-lol-gold" />
      </div>
    </div>
  );
}
