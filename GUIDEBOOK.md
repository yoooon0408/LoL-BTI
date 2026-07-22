# LoL 챔피언 추천 — 프로젝트 가이드북

> AI와의 대화를 통해 리그 오브 레전드 입문자에게 맞는 포지션과 챔피언을 추천해주는 웹 앱

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [핵심 동작 원리](#4-핵심-동작-원리)
5. [시작하기](#5-시작하기)
6. [주요 파일 설명](#6-주요-파일-설명)
7. [커스터마이징 가이드](#7-커스터마이징-가이드)
8. [아키텍처 다이어그램](#8-아키텍처-다이어그램)

---

## 1. 프로젝트 개요

### 무엇을 만드는가

리그 오브 레전드를 처음 시작하는 사람이 **어떤 챔피언을 골라야 할지** 막막할 때 도움을 주는 AI 추천 웹앱입니다.

사용자는 AI와 자연스러운 한국어 대화를 나누며 자신의 취향을 알아갑니다. AI는 5~7번의 대화 끝에 **주 포지션 1개 + 부 포지션 1개** 및 **각 포지션별 추천 챔피언 3개**를 제시합니다.

### 사용 흐름

```
사용자 접속
    ↓
AI 웰컴 메시지 (자동 표시)
    ↓
대화 시작 (게임 스타일 / 시각적 취향 / 복잡성 선호 등)
    ↓
5~7번 주고받기
    ↓
AI가 포지션 2개 + 챔피언 6개 추천
    ↓
카드 형태 결과 화면 표시
    ↓
다시 추천받기 버튼으로 재시작
```

---

## 2. 기술 스택

| 역할 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v3 |
| AI 모델 | Claude Opus 4.8 (`claude-opus-4-8`) |
| AI SDK | `@anthropic-ai/sdk` |
| 스트리밍 | Server-Sent Events (SSE) |
| 챔피언 이미지 | Riot Data Dragon CDN |

---

## 3. 프로젝트 구조

```
project/
├── src/
│   ├── app/
│   │   ├── globals.css          # 전역 스타일 (LoL 테마 + Tailwind)
│   │   ├── layout.tsx           # 루트 레이아웃 (메타데이터 설정)
│   │   ├── page.tsx             # 메인 페이지 (상태 관리 허브)
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts     # Claude API 스트리밍 엔드포인트
│   ├── components/
│   │   ├── ChatContainer.tsx    # 채팅 전체 레이아웃 조합
│   │   ├── ChatMessage.tsx      # 개별 메시지 버블 + 스트리밍 커서
│   │   ├── ChatInput.tsx        # 텍스트 입력 폼
│   │   └── RecommendationResult.tsx  # 최종 추천 카드 UI
│   ├── lib/
│   │   ├── anthropic.ts         # Anthropic 클라이언트 싱글톤
│   │   ├── champions.ts         # 챔피언 데이터 유틸리티 함수
│   │   └── prompts.ts           # 시스템 프롬프트 빌더 + 웰컴 메시지
│   └── types/
│       └── index.ts             # 공유 TypeScript 타입 정의
├── data/
│   └── champions.json           # 포지션별 챔피언 데이터 (30명)
├── public/                      # 정적 파일 (아이콘 등 추가 가능)
├── .env.local.example           # 환경변수 템플릿
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 핵심 동작 원리

### 4-1. 대화 → 추천 감지 방식

Claude는 충분한 대화가 끝나면 응답 텍스트 안에 특수 마커를 포함합니다:

```
[자연어 설명 텍스트]

<<RECOMMENDATION>>
{ ... JSON ... }
<<END_RECOMMENDATION>>
```

프론트엔드(`page.tsx`)는 스트리밍이 완료된 뒤 이 마커를 파싱합니다:
- 마커 **이전 텍스트** → 일반 채팅 메시지로 표시
- 마커 **사이 JSON** → `Recommendation` 타입으로 파싱 후 카드 UI 렌더링
- 스트리밍 **중에는** 마커 이후 텍스트를 숨겨 JSON이 화면에 노출되지 않음

### 4-2. 스트리밍 구조

```
[브라우저]                    [Next.js API Route]             [Claude API]
   │                                  │                            │
   │── POST /api/chat ────────────→   │                            │
   │   { messages: [...] }            │── stream 요청 ──────────→  │
   │                                  │                            │
   │  ←── text/event-stream ────────  │  ←── content_block_delta ─ │
   │  data: {"text":"안녕"}           │      (text_delta만 전달)    │
   │  data: {"text":"하세요"}         │                            │
   │  data: [DONE]                    │── message_stop ──────────→ │
```

`thinking` 블록(Claude의 내부 사고 과정)은 API 라우트에서 필터링되어 사용자에게 노출되지 않습니다.

### 4-3. 시스템 프롬프트 구성

`src/lib/prompts.ts`의 `buildSystemPrompt()` 함수가 실행 시 `data/champions.json`을 읽어 챔피언 목록을 동적으로 프롬프트에 주입합니다. 덕분에 챔피언 데이터를 수정하면 AI가 즉시 반영합니다.

---

## 5. 시작하기

### 사전 요구사항

- Node.js 20+
- [Anthropic API 키](https://console.anthropic.com/)

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 ANTHROPIC_API_KEY 값 입력

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 6. 주요 파일 설명

### `src/app/page.tsx` — 상태 관리 허브

앱의 핵심 상태를 관리합니다:

| 상태 | 타입 | 역할 |
|---|---|---|
| `messages` | `Message[]` | 전체 대화 이력 |
| `streamingContent` | `string` | 현재 스트리밍 중인 텍스트 |
| `isStreaming` | `boolean` | API 응답 수신 중 여부 |
| `recommendation` | `Recommendation \| null` | 파싱된 추천 결과 |
| `conversationEnded` | `boolean` | 추천 완료 여부 (입력창 잠금) |

**`sendMessage` 함수 흐름:**
1. 사용자 메시지를 상태에 추가
2. `POST /api/chat`으로 전체 대화 이력 전송
3. SSE 스트림을 읽으며 `streamingContent` 업데이트
4. `[DONE]` 수신 시 `extractRecommendation()` 호출
5. 추천 JSON이 감지되면 `recommendation` 상태 업데이트

### `src/app/api/chat/route.ts` — AI 스트리밍 엔드포인트

Claude SDK의 `.stream()` 메서드를 사용해 스트리밍 응답을 SSE 형식으로 변환합니다.

- `thinking: { type: 'adaptive' }` — Claude가 필요할 때만 내부적으로 사고 (비용 최적화)
- `content_block_delta` 이벤트 중 `text_delta` 타입만 전달 (thinking 블록 자동 필터)

### `src/lib/prompts.ts` — 시스템 프롬프트

AI의 행동 방식을 정의합니다:
- 한국어 대화 진행
- 5~7번 질문 후 추천
- `<<RECOMMENDATION>>`/`<<END_RECOMMENDATION>>` 마커 포함 JSON 출력 규칙
- 챔피언 목록을 동적으로 주입

### `data/champions.json` — 챔피언 데이터

각 챔피언의 속성:

```typescript
{
  name: string;       // 영어 이름 (Data Dragon ID)
  koreanName: string; // 한국어 이름
  imageId: string;    // Data Dragon 이미지 ID
  difficulty: string; // 난이도 ("매우 쉬움" ~ "매우 어려움")
  style: string[];    // 플레이 스타일 태그
  gameStyle: string;  // aggressive | defensive | support | control
  visual: string[];   // 시각적 특징 태그
  setting: string[];  // 세계관 설정 태그
  description: string;// 한 줄 설명
  tags: string[];     // 전체 검색 태그
}
```

---

## 7. 커스터마이징 가이드

### 챔피언 추가/수정

`data/champions.json`에 항목을 추가하면 AI 프롬프트에 자동 반영됩니다.

> **imageId 주의:** Data Dragon의 정확한 파일명을 사용해야 이미지가 로드됩니다.
> 예: `Master Yi` → `"MasterYi"`, `Miss Fortune` → `"MissFortune"`

### AI 모델 변경

`src/lib/anthropic.ts`의 `MODEL` 상수를 수정하세요:

```typescript
// 기본값: claude-opus-4-8 (최고 성능)
export const MODEL = 'claude-opus-4-8';

// 비용 절감이 필요하면:
export const MODEL = 'claude-sonnet-4-6';
```

### 질문 스타일 변경

`src/lib/prompts.ts`의 `buildSystemPrompt()` 함수 내 시스템 프롬프트 텍스트를 수정하세요.

### Data Dragon 버전 업데이트

`src/lib/champions.ts`의 `getChampionImageUrl()` 함수에서 버전을 업데이트하세요:

```typescript
// 현재 버전
return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${imageId}.png`;

// 최신 버전 확인: https://ddragon.leagueoflegends.com/api/versions.json
```

### 색상 테마 변경

`tailwind.config.ts`의 `theme.extend.colors`에서 LoL 테마 색상을 수정하세요.

---

## 8. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────┐
│                 브라우저 (Next.js)            │
│                                             │
│  page.tsx ──────────────────────────────    │
│  │ 상태 관리                                 │
│  │ messages / streaming / recommendation    │
│  │                                          │
│  ├── ChatContainer.tsx                      │
│  │   ├── ChatMessage.tsx (버블)              │
│  │   ├── StreamingMessage (커서)             │
│  │   ├── ChatInput.tsx (입력)                │
│  │   └── RecommendationResult.tsx (카드)     │
│  │                                          │
│  └── fetch POST /api/chat ─────────────     │
│                              ↕ SSE          │
└──────────────────────────────│──────────────┘
                               │
┌──────────────────────────────│──────────────┐
│            Next.js API Route  │              │
│                               ↕              │
│  route.ts                                   │
│  ├── buildSystemPrompt() → champions.json   │
│  ├── anthropic.messages.stream()            │
│  └── content_block_delta → SSE              │
└─────────────────────────────────────────────┘
                               │
┌──────────────────────────────│──────────────┐
│           Anthropic API       │              │
│                               ↕              │
│  Model: claude-opus-4-8                     │
│  Thinking: adaptive                         │
│  System: 챔피언 추천 프롬프트               │
└─────────────────────────────────────────────┘
```

---

*이 프로젝트는 교육 목적으로 만들어졌습니다. 리그 오브 레전드 및 관련 자산은 Riot Games의 소유입니다.*
