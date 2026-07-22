import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const MODEL = 'claude-opus-4-8';
export const MAX_TOKENS = 4096;
