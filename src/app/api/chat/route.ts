import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/prompts';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  role: {
    frontline: '앞에 서서 직접 싸우기 (전사·탱커 스타일)',
    ranged: '원거리에서 안전하게 딜 (원딜·마법사 스타일)',
    support: '팀원 옆에서 함께 이기기 (서포터 스타일)',
    jungle: '혼자 다니며 기회 노리기 (정글러 스타일)',
  },
  lane: {
    stay: '내 성장에 집중 (안정적인 라인전)',
    roam: '여기저기 누비며 영향력 발휘',
  },
  playstyle: {
    carry: '내가 직접 처치하며 주도 (하드캐리)',
    utility: '판을 짜고 팀이 이기도록 지원 (유틸·컨트롤)',
  },
  visual: {
    heroic: '용맹하고 멋진 전사',
    dark: '어둡고 공포스러운',
    cute: '귀엽거나 밝고 친근한',
    tech: '기계·로봇·SF',
  },
  skill: {
    simple: '단순하고 강력한 스킬',
    complex: '복잡하지만 화려한 콤보',
  },
};

const ANSWER_KEYS = ['role', 'lane', 'playstyle', 'visual', 'skill'] as const;

function buildMessages(answers: string[], freeText: string): Anthropic.MessageParam[] {
  const labels = ANSWER_KEYS.map(
    (key, i) => ANSWER_LABELS[key]?.[answers[i]] ?? answers[i] ?? '(미응답)'
  );
  const [role, lane, playstyle, visual, skill] = labels;

  const extra = freeText.trim();

  return [
    { role: 'user',      content: role || '(미응답)' },
    { role: 'assistant', content: '어떤 스타일인지 잘 알겠어요! 라인에서는 어떻게 플레이하고 싶으세요?' },
    { role: 'user',      content: lane || '(미응답)' },
    { role: 'assistant', content: '좋아요! 팀에서 어떤 역할로 이기고 싶으세요?' },
    { role: 'user',      content: playstyle || '(미응답)' },
    { role: 'assistant', content: '알겠어요! 어떤 느낌의 챔피언이 시각적으로 끌리세요?' },
    { role: 'user',      content: visual || '(미응답)' },
    { role: 'assistant', content: '좋아요! 스킬 스타일은 어떤 게 좋으세요?' },
    { role: 'user',      content: skill || '(미응답)' },
    { role: 'assistant', content: '마지막으로, 추가로 반영할 게 있으신가요?' },
    { role: 'user',      content: extra || '없어요.' },
    // 어시스턴트가 "이제 추천할게요"를 선언 → 모델이 추천 단계임을 인식
    {
      role: 'assistant',
      content: '이제 딱 맞는 챔피언을 찾은 것 같아요! 바로 추천해드릴게요.',
    },
    // 최종 지시: 입력 품질과 무관하게 반드시 JSON 블록 출력
    {
      role: 'user',
      content:
        '지금 바로 추천 결과를 출력해주세요. 위 대화 내용을 최대한 참고하되, 내용이 불명확하더라도 반드시 <<RECOMMENDATION>>...<<END_RECOMMENDATION>> JSON 형식으로 결과를 출력해야 합니다.',
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { answers?: string[]; freeText?: string };
    const answers = body.answers ?? [];
    const freeText = body.freeText ?? '';

    const messages = buildMessages(answers, freeText);
    const systemPrompt = buildSystemPrompt();

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
