'use client';

import { useEffect, useRef } from 'react';
import type { Message, Recommendation } from '@/types';
import ChatMessage, { StreamingMessage, TypingIndicator } from './ChatMessage';
import ChatInput from './ChatInput';
import RecommendationResult from './RecommendationResult';

interface Props {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  recommendation: Recommendation | null;
  conversationEnded: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}

export default function ChatContainer({
  messages,
  streamingContent,
  isStreaming,
  recommendation,
  conversationEnded,
  onSend,
  onReset,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 오면 스크롤 하단으로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, recommendation]);

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* 스트리밍 중인 메시지 */}
        {isStreaming && streamingContent && (
          <StreamingMessage content={streamingContent} />
        )}

        {/* 타이핑 인디케이터 (스트리밍 시작 전) */}
        {isStreaming && !streamingContent && <TypingIndicator />}

        {/* 추천 결과 */}
        {recommendation && (
          <div className="mt-2">
            <RecommendationResult recommendation={recommendation} onReset={onReset} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="px-4 pb-5 pt-3 border-t border-lol-blue/30">
        {conversationEnded ? (
          <div className="text-center">
            <p className="text-lol-text/60 text-xs mb-3">추천이 완료되었습니다</p>
            <button
              onClick={onReset}
              className="px-6 py-2.5 rounded-xl border border-lol-gold/40 text-lol-gold text-sm font-semibold
                hover:bg-lol-gold/10 hover:border-lol-gold transition-all duration-200"
            >
              처음부터 다시 시작하기
            </button>
          </div>
        ) : (
          <ChatInput
            onSend={onSend}
            disabled={isStreaming}
            placeholder={isStreaming ? 'AI가 답변 중입니다...' : '메시지를 입력하세요...'}
          />
        )}
      </div>
    </div>
  );
}
