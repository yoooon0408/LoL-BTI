import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'LoL 챔피언 추천 | 나에게 딱 맞는 챔피언 찾기',
  description: 'AI와의 대화를 통해 리그 오브 레전드 입문자에게 맞는 포지션과 챔피언을 추천받으세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3324473678281728"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-lol-dark antialiased">
        {children}
      </body>
    </html>
  );
}
