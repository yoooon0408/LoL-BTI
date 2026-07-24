import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | LoL-BTI',
  description: 'LoL-BTI 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-lol-dark text-lol-text">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-lol-gold-light mb-2">개인정보처리방침</h1>
        <p className="text-lol-text/50 text-sm mb-10">최종 수정일: 2026년 7월 24일</p>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">1. 개요</h2>
          <p className="text-sm leading-relaxed text-lol-text/80">
            LoL-BTI (이하 &quot;서비스&quot;, 운영 도메인: lolbti.lol)는 사용자의 개인정보를 소중히 여기며,
            관련 법령에 따라 이를 보호하기 위해 노력합니다. 본 방침은 서비스가 수집하는 정보와
            그 이용 방식을 안내합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">2. 수집하는 정보</h2>
          <p className="text-sm leading-relaxed text-lol-text/80 mb-3">
            본 서비스는 회원가입이나 로그인 없이 이용 가능하며, 별도의 개인 식별 정보를 수집하지 않습니다.
            다만 서비스 운영 과정에서 아래와 같은 정보가 자동으로 수집될 수 있습니다.
          </p>
          <ul className="text-sm leading-relaxed text-lol-text/80 list-disc list-inside space-y-1">
            <li>접속 IP 주소, 브라우저 종류, 방문 일시 등 서버 로그 정보</li>
            <li>서비스 이용 중 선택한 성향 답변 (개인 식별 불가 데이터)</li>
            <li>광고 제공을 위한 쿠키 및 유사 기술을 통한 정보</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">3. 쿠키(Cookie) 사용</h2>
          <p className="text-sm leading-relaxed text-lol-text/80 mb-3">
            본 서비스는 광고 서비스 제공을 위해 Google AdSense가 설정하는 쿠키를 사용합니다.
            쿠키는 이용자의 브라우저에 저장되는 소량의 데이터입니다.
          </p>
          <p className="text-sm leading-relaxed text-lol-text/80">
            브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">4. 광고 서비스 (Google AdSense)</h2>
          <p className="text-sm leading-relaxed text-lol-text/80 mb-3">
            본 서비스는 Google AdSense를 통해 광고를 제공합니다. Google은 DoubleClick 쿠키를
            사용하여 이용자의 이전 방문 기록을 기반으로 맞춤형 광고를 게재할 수 있습니다.
          </p>
          <p className="text-sm leading-relaxed text-lol-text/80 mb-3">
            Google의 광고 쿠키 사용 방식에 대한 자세한 내용은 아래에서 확인하실 수 있습니다.
          </p>
          <ul className="text-sm leading-relaxed text-lol-text/80 list-disc list-inside space-y-1">
            <li>
              Google 개인정보처리방침:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lol-gold/80 underline hover:text-lol-gold"
              >
                policies.google.com/privacy
              </a>
            </li>
            <li>
              Google 광고 설정:{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lol-gold/80 underline hover:text-lol-gold"
              >
                google.com/settings/ads
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">5. AI 서비스 이용</h2>
          <p className="text-sm leading-relaxed text-lol-text/80">
            본 서비스는 챔피언 추천을 위해 Anthropic의 Claude AI API를 활용합니다.
            이용자가 선택한 성향 정보는 추천 결과 생성 목적으로만 AI에 전달되며,
            별도로 저장되거나 식별 목적으로 사용되지 않습니다.
            Anthropic의 개인정보처리방침은{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lol-gold/80 underline hover:text-lol-gold"
            >
              anthropic.com/privacy
            </a>
            에서 확인할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">6. 제3자 제공</h2>
          <p className="text-sm leading-relaxed text-lol-text/80">
            본 서비스는 법령에 따른 경우를 제외하고 이용자의 정보를 제3자에게 제공하거나
            공유하지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">7. 미성년자 보호</h2>
          <p className="text-sm leading-relaxed text-lol-text/80">
            본 서비스는 만 14세 미만 아동으로부터 의도적으로 개인정보를 수집하지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">8. 방침 변경</h2>
          <p className="text-sm leading-relaxed text-lol-text/80">
            본 개인정보처리방침은 법령 또는 서비스 변경에 따라 업데이트될 수 있으며,
            변경 시 본 페이지를 통해 공지합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lol-gold text-base font-bold mb-3">9. 문의</h2>
          <p className="text-sm leading-relaxed text-lol-text/80">
            개인정보 관련 문의사항은 아래 이메일로 연락해 주세요.
          </p>
          <p className="text-sm text-lol-gold/80 mt-2">yoooon0408@gmail.com</p>
        </section>

        <div className="mt-10 pt-6 border-t border-lol-blue/30">
          <a href="/" className="text-lol-text/40 text-xs hover:text-lol-text/70 transition-colors">
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
