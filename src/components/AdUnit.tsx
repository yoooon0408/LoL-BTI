'use client';

import { useEffect, useRef } from 'react';

type AdType = 'leaderboard' | 'sidebar' | 'rectangle';

interface Props {
  type: AdType;
  slot?: string;       // Google AdSense slot ID
  clientId?: string;   // Google AdSense client ID (ca-pub-XXXXXXXX)
  className?: string;
}

const AD_SIZES: Record<AdType, { width: number; height: number; label: string }> = {
  leaderboard: { width: 728, height: 90,  label: '728 × 90' },
  sidebar:     { width: 160, height: 600, label: '160 × 600' },
  rectangle:   { width: 300, height: 250, label: '300 × 250' },
};

export default function AdUnit({ type, slot, clientId, className = '' }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const isDev = process.env.NODE_ENV === 'development';
  const hasAdConfig = !isDev && slot && clientId;
  const { width, height, label } = AD_SIZES[type];

  useEffect(() => {
    if (!hasAdConfig) return;
    try {
      // @ts-expect-error adsbygoogle is injected by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 스크립트 미로드 시 무시
    }
  }, [hasAdConfig]);

  // 개발 환경 또는 AdSense 미설정 시 플레이스홀더 표시
  if (!hasAdConfig) {
    return (
      <div
        className={`flex items-center justify-center bg-lol-navy/40 border border-lol-blue/20 rounded-lg ${className}`}
        style={{ width: '100%', maxWidth: width, height }}
      >
        <div className="text-center">
          <p className="text-lol-text/30 text-[10px] font-medium tracking-wider uppercase">
            광고
          </p>
          <p className="text-lol-text/20 text-[9px] mt-0.5">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', width, height }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={type === 'leaderboard' ? 'horizontal' : 'auto'}
      data-full-width-responsive="true"
    />
  );
}
