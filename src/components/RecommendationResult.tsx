'use client';

import type { Recommendation, RecommendedChampion } from '@/types';
import { getPositionImage, getChampionImageUrl } from '@/lib/champions';

interface Props {
  recommendation: Recommendation;
  onReset: () => void;
}

const POSITION_EMOJI: Record<string, string> = {
  탑: '🛡️',
  정글: '🌿',
  미드: '⚡',
  원딜: '🏹',
  서포터: '💫',
};

const RIOT_CLASS_COLOR: Record<string, string> = {
  암살자: 'bg-red-900/40 text-red-300 border-red-700/50',
  전사: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
  원거리: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  마법사: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  탱커: 'bg-slate-700/60 text-slate-200 border-slate-500/50',
  서포터: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
};

function ChampionCard({
  champion,
  rank,
}: {
  champion: RecommendedChampion & { riotClass?: string };
  rank: number;
}) {
  const championImageUrl = getChampionImageUrl(champion.imageId);

  return (
    <div className="rounded-2xl bg-lol-dark/60 border border-lol-blue/50 hover:border-lol-gold/40 transition-all duration-200 animate-slide-up overflow-hidden">
      {/* 상단: 초상화 + 이름/뱃지 */}
      <div className="flex gap-4 p-4">
        {/* 초상화 */}
        <div className="flex-shrink-0 relative">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-lol-gold-dim">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={championImageUrl}
              alt={champion.koreanName}
              className="w-full h-full object-cover object-top scale-[1.15] origin-top"
            />
          </div>
          {/* 순위 배지 */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-lol-dark border border-lol-gold/70 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-lol-gold font-bold text-[11px] leading-none">{rank}</span>
          </div>
        </div>

        {/* 이름 + 뱃지 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <span className="text-lol-gold-light font-bold text-lg leading-tight">{champion.koreanName}</span>
            <span className="text-lol-text/40 text-xs">{champion.name}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {champion.riotClass && (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  RIOT_CLASS_COLOR[champion.riotClass] ?? 'bg-lol-blue/40 text-lol-text border-lol-blue'
                }`}
              >
                {champion.riotClass}
              </span>
            )}
            {champion.riotSubClass && (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium border opacity-70 ${
                  RIOT_CLASS_COLOR[champion.riotSubClass] ?? 'bg-lol-blue/40 text-lol-text border-lol-blue'
                }`}
              >
                {champion.riotSubClass}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 추천 이유 */}
      <div className="px-4 pb-4">
        <div className="pt-3 border-t border-lol-blue/30">
          <p className="text-xs text-lol-gold/70 font-semibold tracking-wider uppercase mb-1.5">추천 이유</p>
          <p className="text-lol-text text-sm leading-relaxed">
            {champion.reason}
          </p>
        </div>
      </div>
    </div>
  );
}

function PositionSection({
  position,
  isPrimary,
  reason,
  champions,
}: {
  position: string;
  isPrimary: boolean;
  reason: string;
  champions: (RecommendedChampion & { riotClass?: string })[];
}) {
  const roleImage = getPositionImage(position);

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isPrimary
          ? 'border-lol-gold/60 shadow-[0_0_20px_rgba(200,155,60,0.15)]'
          : 'border-lol-blue'
      }`}
    >
      {/* 역할군 이미지 배너 */}
      <div className="relative h-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={roleImage}
          alt={`${position} 역할군`}
          className="w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.45) saturate(1.2)' }}
        />
        {/* 배너 텍스트 */}
        <div className="absolute inset-0 flex items-center px-4 gap-3">
          <span className="text-3xl">{POSITION_EMOJI[position] ?? '🎮'}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg drop-shadow-lg">{position}</h3>
              {isPrimary ? (
                <span className="px-2 py-0.5 rounded-full bg-lol-gold/90 text-lol-dark text-[10px] font-bold">
                  주 포지션
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold">
                  부 포지션
                </span>
              )}
            </div>
            <p className="text-white/80 text-xs drop-shadow mt-0.5 line-clamp-1">{reason}</p>
          </div>
        </div>
      </div>

      {/* 챔피언 목록 */}
      <div className="p-3 bg-lol-navy/80 flex flex-col gap-2">
        {champions.map((champ, i) => (
          <ChampionCard
            key={champ.name}
            champion={champ}
            rank={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function RecommendationResult({ recommendation, onReset }: Props) {
  const { lolMbti, primaryPosition, secondaryPosition, positionReasons, champions } = recommendation;

  return (
    <div className="w-full animate-slide-up">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lol-gold/10 border border-lol-gold/30 mb-3">
          <span className="text-lol-gold text-xs font-semibold tracking-wider">✨ 추천 완료</span>
        </div>
        <h2 className="text-lol-gold-light text-xl font-bold text-shadow-gold">
          당신을 위한 LoL-BTI 결과
        </h2>
        <p className="text-lol-text/60 text-sm mt-1">
          선택하신 스타일에 맞는 성향과 챔피언이에요
        </p>
      </div>

      {/* LoL MBTI 카드 */}
      {lolMbti && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-lol-gold/60 shadow-[0_0_24px_rgba(200,155,60,0.18)]">
          <div className="bg-gradient-to-br from-lol-gold/20 to-lol-blue/10 px-5 py-5">
            <p className="text-lol-gold/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">LoL-BTI 유형</p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-lol-gold text-4xl font-black tracking-wider">{lolMbti.type}</span>
              <span className="text-lol-gold-light text-base font-bold">{lolMbti.title}</span>
            </div>
            <p className="text-lol-text/80 text-sm leading-relaxed">{lolMbti.description}</p>
          </div>
        </div>
      )}

      {/* 주 포지션 */}
      <PositionSection
        position={primaryPosition}
        isPrimary
        reason={positionReasons[primaryPosition] ?? ''}
        champions={champions[primaryPosition] ?? []}
      />

      {/* 구분선 */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-lol-blue/30" />
        <span className="text-lol-text/30 text-xs">부 포지션 추천</span>
        <div className="flex-1 h-px bg-lol-blue/30" />
      </div>

      {/* 부 포지션 */}
      <PositionSection
        position={secondaryPosition}
        isPrimary={false}
        reason={positionReasons[secondaryPosition] ?? ''}
        champions={champions[secondaryPosition] ?? []}
      />

      {/* 안내 */}
      <div className="mt-5 p-3 rounded-xl bg-lol-navy/50 border border-lol-blue/30">
        <p className="text-lol-text/50 text-xs text-center">
          전사/암살자: 근접 딜러 · 원거리/마법사: 원거리 딜러 · 탱커/서포터: 보조 역할
        </p>
      </div>

      {/* 다시 시작 버튼 */}
      <button
        onClick={onReset}
        className="w-full mt-4 py-3 rounded-xl border border-lol-gold/40 text-lol-gold text-sm font-semibold
          hover:bg-lol-gold/10 hover:border-lol-gold transition-all duration-200"
      >
        처음부터 다시하기
      </button>
    </div>
  );
}
