export type Position = '탑' | '정글' | '미드' | '원딜' | '서포터';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type RiotClass = '암살자' | '전사' | '원거리' | '마법사' | '탱커' | '서포터';

export interface ChampionData {
  name: string;
  koreanName: string;
  imageId: string;
  positions: Position[];
  riotClass: RiotClass;
  riotSubClass: RiotClass | null;
  difficulty: string;
  style: string[];
  gameStyle: string;
  visual: string[];
  setting: string[];
  description: string;
  tags: string[];
}

export interface RecommendedChampion {
  name: string;
  koreanName: string;
  imageId: string;
  riotClass?: string;
  riotSubClass?: string | null;
  reason: string;
}

export interface LolMbti {
  code: string;
  title: string;
  description: string;
}

export interface Recommendation {
  lolMbti: LolMbti;
  primaryPosition: Position;
  secondaryPosition: Position;
  positionReasons: Record<string, string>;
  champions: Record<string, RecommendedChampion[]>;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  recommendation: Recommendation | null;
  conversationEnded: boolean;
}
