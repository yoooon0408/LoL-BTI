import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'LoL 챔피언 추천 | 나에게 딱 맞는 챔피언 찾기',
  description: 'AI와의 대화를 통해 리그 오브 레전드 입문자에게 맞는 포지션과 챔피언을 추천받으세요.',
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-lol-dark antialiased">
        {children}
        {/* Google AdSense — NEXT_PUBLIC_ADSENSE_CLIENT 설정 시에만 로드 */}
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
