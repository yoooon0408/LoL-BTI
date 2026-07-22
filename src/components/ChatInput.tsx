'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = '메시지를 입력하세요...' }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className={`
            w-full resize-none rounded-xl px-4 py-3 text-sm
            bg-lol-navy-light border border-lol-blue text-lol-text-bright
            placeholder-lol-text/50 outline-none
            transition-all duration-200 leading-relaxed
            focus:border-lol-gold focus:shadow-[0_0_12px_rgba(200,155,60,0.25)]
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        />
      </div>

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={`
          flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${disabled || !value.trim()
            ? 'bg-lol-navy-light border border-lol-blue text-lol-text/30 cursor-not-allowed'
            : 'bg-lol-gold hover:bg-yellow-400 text-lol-dark font-bold shadow-[0_0_12px_rgba(200,155,60,0.4)] hover:shadow-[0_0_20px_rgba(200,155,60,0.6)]'
          }
        `}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
}
