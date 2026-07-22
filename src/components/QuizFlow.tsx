'use client';

import { useState } from 'react';
import type { Recommendation } from '@/types';
import RecommendationResult from './RecommendationResult';

type Option = { id: string; label: string; desc: string };
type QuizStep = { question: string; subtitle: string; options: Option[] };

const STEPS: QuizStep[] = [
  {
    question: '게임에서 어떤 역할이 끌리세요?',
    subtitle: '원하는 전투 스타일을 골라주세요',
    options: [
      { id: 'frontline', label: '앞에 서서 직접 싸우기',     desc: '전사·탱커 스타일' },
      { id: 'ranged',    label: '원거리에서 안전하게 딜',    desc: '원딜·마법사 스타일' },
      { id: 'support',   label: '팀원 옆에서 함께 이기기',   desc: '서포터 스타일' },
      { id: 'jungle',    label: '혼자 다니며 기회 노리기',   desc: '정글러 스타일' },
    ],
  },
  {
    question: '라인에서 어떻게 플레이하고 싶으세요?',
    subtitle: '주로 어떤 상황을 즐기나요?',
    options: [
      { id: 'stay', label: '내 성장에 집중',                 desc: '안정적인 라인전 선호' },
      { id: 'roam', label: '여기저기 누비며 영향력 발휘',   desc: '게임 전체를 뛰어다니는 스타일' },
    ],
  },
  {
    question: '팀에서 어떤 역할로 이기고 싶으세요?',
    subtitle: '이기는 방식을 골라주세요',
    options: [
      { id: 'carry',   label: '내가 직접 처치하며 주도',       desc: '하드캐리 — 데미지·처치 중심' },
      { id: 'utility', label: '판을 짜고 팀이 이기도록 지원', desc: '유틸·컨트롤 — CC·팀파이트 중심' },
    ],
  },
  {
    question: '어떤 느낌의 챔피언이 끌리나요?',
    subtitle: '시각적 취향을 골라주세요',
    options: [
      { id: 'heroic', label: '용맹하고 멋진 전사',    desc: '갑옷, 검, 영웅적인 느낌' },
      { id: 'dark',   label: '어둡고 공포스러운',      desc: '공포, 언데드, 악마 느낌' },
      { id: 'cute',   label: '귀엽거나 밝고 친근한',   desc: '동물, 팬시, 친근한 느낌' },
      { id: 'tech',   label: '기계·로봇·SF',           desc: '사이버펑크, 기술, 미래 느낌' },
    ],
  },
  {
    question: '어떤 스킬 스타일을 좋아하세요?',
    subtitle: '재미를 기준으로 골라주세요',
    options: [
      { id: 'simple',  label: '단순하고 강력한 스킬',     desc: '배우기 쉽고 즉각적인 만족감' },
      { id: 'complex', label: '복잡하지만 화려한 콤보',   desc: '연습할수록 성장하는 짜릿함' },
    ],
  },
];

const TOTAL_STEPS = STEPS.length + 1;

// ─────────────────────────────────────────────
// 시작 페이지
// ─────────────────────────────────────────────
function IntroPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-full overflow-y-auto">
    <div className="min-h-full flex flex-col items-center justify-center px-8 py-8 text-center">
      {/* 엠블렘 */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lol-gold/20 to-lol-blue/20 border border-lol-gold/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,155,60,0.2)]">
        <span className="text-4xl">⚔️</span>
      </div>

      {/* 타이틀 */}
      <h2 className="text-lol-gold-light text-2xl font-bold text-shadow-gold mb-2">
        챔피언 추천
      </h2>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-px bg-lol-gold/40" />
        <span className="text-lol-gold/50 text-[10px] tracking-[0.2em] uppercase">League of Legends</span>
        <div className="w-8 h-px bg-lol-gold/40" />
      </div>
      <p className="text-lol-text/50 text-sm leading-relaxed mb-10">
        몇 가지 질문으로 나에게 딱 맞는<br />포지션과 챔피언을 추천해드려요
      </p>

      {/* 특징 */}
      <div className="w-full max-w-xs flex flex-col gap-2 mb-10">
        {[
          ['🎯', '5가지 선택 질문'],
          ['🗺️', '맞춤 포지션 분석'],
          ['🏆', '챔피언 3명 + 추천 이유 제공'],
        ].map(([icon, text]) => (
          <div
            key={text}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-lol-dark/40 border border-lol-blue/30 text-left"
          >
            <span className="text-xl">{icon}</span>
            <span className="text-lol-text/80 text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 rounded-xl bg-lol-gold/20 border border-lol-gold/70
          text-lol-gold font-bold text-base tracking-wide
          hover:bg-lol-gold/30 hover:border-lol-gold hover:shadow-[0_0_20px_rgba(200,155,60,0.3)]
          active:scale-[0.98] transition-all duration-200"
      >
        시작하기 →
      </button>
    </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 질문 단계
// ─────────────────────────────────────────────
function QuestionStep({
  step,
  onSelect,
}: {
  step: QuizStep;
  onSelect: (id: string) => void;
}) {
  const isGrid = step.options.length === 4;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lol-gold-light text-xl font-bold leading-tight">{step.question}</h2>
        <p className="text-lol-text/60 text-sm mt-1">{step.subtitle}</p>
      </div>
      <div className={isGrid ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
        {step.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="flex flex-col items-start text-left p-4 rounded-xl border border-lol-blue/50
              bg-lol-dark/40 hover:bg-lol-gold/10 hover:border-lol-gold/60
              active:scale-[0.98] transition-all duration-200 group"
          >
            <span className="text-lol-gold-light font-semibold text-sm group-hover:text-lol-gold transition-colors">
              {opt.label}
            </span>
            <span className="text-lol-text/50 text-xs mt-0.5">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 자유 입력 단계
// ─────────────────────────────────────────────
function FreeTextStep({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lol-gold-light text-xl font-bold leading-tight">
          추가로 원하는 게 있으신가요?
        </h2>
        <p className="text-lol-text/60 text-sm mt-1">
          좋아하는 색감, 다른 게임·애니 캐릭터, 플레이 스타일 등 자유롭게 입력하거나 건너뛰세요
        </p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예: 여자 캐릭터였으면 좋겠어요 / 나루토 같은 느낌 / 파란색 계열..."
        className="w-full h-28 px-4 py-3 rounded-xl bg-lol-dark/60 border border-lol-blue/50
          text-lol-text text-sm placeholder-lol-text/30 resize-none
          focus:outline-none focus:border-lol-gold/50 transition-colors"
      />
      <div className="flex gap-3">
        <button
          onClick={() => onSubmit('')}
          className="flex-1 py-3 rounded-xl border border-lol-blue/50 text-lol-text/60 text-sm
            hover:border-lol-text/30 hover:text-lol-text/80 transition-all duration-200"
        >
          건너뛰기
        </button>
        <button
          onClick={() => onSubmit(text)}
          className="flex-1 py-3 rounded-xl bg-lol-gold/20 border border-lol-gold/60
            text-lol-gold text-sm font-semibold hover:bg-lol-gold/30 transition-all duration-200"
        >
          추천받기 →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 QuizFlow
// ─────────────────────────────────────────────
export default function QuizFlow() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isFreeTextStep = step === STEPS.length;

  const handleSelect = (optionId: string) => {
    setAnswers([...answers.slice(0, step), optionId]);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (extra: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, freeText: extra }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break outer;
          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) fullContent += parsed.text;
          } catch (e) {
            if (e instanceof Error && !e.message.includes('JSON')) throw e;
          }
        }
      }

      const START = '<<RECOMMENDATION>>';
      const END = '<<END_RECOMMENDATION>>';
      const si = fullContent.indexOf(START);
      const ei = fullContent.indexOf(END);
      if (si !== -1 && ei !== -1) {
        setRecommendation(JSON.parse(fullContent.slice(si + START.length, ei).trim()) as Recommendation);
      } else {
        throw new Error('추천 결과를 받지 못했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setStep(0);
    setAnswers([]);
    setLoading(false);
    setRecommendation(null);
    setError(null);
  };

  // 시작 페이지
  if (!started) {
    return <IntroPage onStart={() => setStarted(true)} />;
  }

  // 결과 페이지 — 스크롤 가능한 컨테이너
  if (recommendation) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            <RecommendationResult recommendation={recommendation} onReset={handleReset} />
          </div>
        </div>
      </div>
    );
  }

  // 로딩
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-lol-gold/30 border-t-lol-gold rounded-full animate-spin" />
        <p className="text-lol-gold text-sm font-medium">챔피언을 분석하는 중...</p>
        <p className="text-lol-text/50 text-xs">잠시만 기다려주세요</p>
      </div>
    );
  }

  // 퀴즈
  return (
    <div className="flex flex-col h-full">
      {/* 진행 상태 */}
      <div className="flex-shrink-0 px-6 pt-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lol-text/40 text-xs font-medium">
            {step + 1} / {TOTAL_STEPS}
          </span>
          {step > 0 && (
            <button
              onClick={handleBack}
              className="text-lol-text/40 hover:text-lol-text/70 text-xs transition-colors"
            >
              ← 이전
            </button>
          )}
        </div>
        <div className="h-1 bg-lol-dark/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-lol-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* 질문 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isFreeTextStep ? (
          <FreeTextStep onSubmit={handleSubmit} />
        ) : (
          <QuestionStep step={STEPS[step]} onSelect={handleSelect} />
        )}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-900/20 border border-red-700/40">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
