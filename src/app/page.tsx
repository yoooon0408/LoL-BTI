'use client';

import QuizFlow from '@/components/QuizFlow';
import AdUnit from '@/components/AdUnit';

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';
const AD_SLOTS = {
  top:   process.env.NEXT_PUBLIC_AD_SLOT_TOP   ?? '',
  left:  process.env.NEXT_PUBLIC_AD_SLOT_LEFT  ?? '',
  right: process.env.NEXT_PUBLIC_AD_SLOT_RIGHT ?? '',
};

export default function Home() {

  return (
    <div className="min-h-screen bg-lol-dark">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lol-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lol-gold/5 rounded-full blur-3xl" />
      </div>

      {/* 3단 레이아웃: 사이드바 광고 + 메인 + 사이드바 광고 */}
      <div className="relative flex items-start justify-center gap-4 px-4 py-4 min-h-screen">

        {/* 왼쪽 사이드바 광고 — 데스크톱(xl+)에서만 표시 */}
        <aside className="hidden xl:flex flex-col items-center gap-4 flex-shrink-0 w-40 sticky top-4">
          <AdUnit type="sidebar" slot={AD_SLOTS.left} clientId={AD_CLIENT} />
        </aside>

        {/* 메인 컨테이너 */}
        <div className="w-full max-w-2xl flex flex-col" style={{ height: '90vh' }}>

          {/* 헤더 */}
          <div className="flex-shrink-0 text-center py-5 px-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-px h-4 bg-lol-gold" />
              <span className="text-lol-gold text-xs tracking-[0.2em] font-semibold uppercase">
                League of Legends
              </span>
              <div className="w-px h-4 bg-lol-gold" />
            </div>
            <h1 className="text-2xl font-bold text-lol-gold-light text-shadow-gold">
              챔피언 추천
            </h1>
            <p className="text-lol-text text-xs mt-1">
              AI와 대화로 나에게 딱 맞는 챔피언을 찾아보세요
            </p>
          </div>

          {/* 상단 배너 광고 — 모바일/태블릿에서만 표시 (xl에서는 사이드바로 대체) */}
          <div className="xl:hidden flex-shrink-0 flex justify-center mb-3">
            <AdUnit type="leaderboard" slot={AD_SLOTS.top} clientId={AD_CLIENT} className="max-w-full" />
          </div>

          {/* 퀴즈 영역 */}
          <div className="flex-1 min-h-0 rounded-2xl gold-border bg-lol-navy overflow-hidden">
            <QuizFlow />
          </div>

          {/* 푸터 */}
          <p className="text-center text-lol-text/30 text-xs mt-3">
            리그 오브 레전드는 Riot Games의 상표입니다
          </p>
        </div>

        {/* 오른쪽 사이드바 광고 — 데스크톱(xl+)에서만 표시 */}
        <aside className="hidden xl:flex flex-col items-center gap-4 flex-shrink-0 w-40 sticky top-4">
          <AdUnit type="sidebar" slot={AD_SLOTS.right} clientId={AD_CLIENT} />
        </aside>

      </div>
    </div>
  );
}
