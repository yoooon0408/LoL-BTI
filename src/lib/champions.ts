import championsData from '../../data/champions.json';
import type { ChampionData, Position } from '@/types';

type ChampionsJson = Record<string, ChampionData[]>;

export function getAllChampions(): ChampionsJson {
  return championsData as ChampionsJson;
}

export function getChampionsByPosition(position: Position): ChampionData[] {
  const data = championsData as ChampionsJson;
  return data[position] ?? [];
}

export function findChampion(nameOrKoreanName: string): ChampionData | undefined {
  const data = championsData as ChampionsJson;
  for (const champions of Object.values(data)) {
    const found = champions.find(
      (c) => c.name === nameOrKoreanName || c.koreanName === nameOrKoreanName
    );
    if (found) return found;
  }
  return undefined;
}

export function getChampionImageUrl(imageId: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/16.12.1/img/champion/${imageId}.png`;
}

// champ 1.png = 암살자/전사, champ 2.png = 원거리/마법사, champ 3.png = 탱커/서포터
const RIOT_CLASS_IMAGE: Record<string, string> = {
  암살자: '/role-1.png',
  전사: '/role-1.png',
  원거리: '/role-2.png',
  마법사: '/role-2.png',
  탱커: '/role-3.png',
  서포터: '/role-3.png',
};

export function getRiotClassImage(riotClass: string): string {
  return RIOT_CLASS_IMAGE[riotClass] ?? '/role-1.png';
}

export function getPositionImage(_position: string): string {
  return '/position-chart.png';
}

export function buildChampionListText(): string {
  const data = championsData as ChampionsJson;

  return Object.entries(data)
    .map(([position, champions]) => {
      const list = champions
        .map((c) => {
          const desc = c.description.length > 80
            ? c.description.slice(0, 80) + '…'
            : c.description;
          const subClass = c.riotSubClass ? ` / 부역할군: ${c.riotSubClass}` : '';
          return `  - ${c.koreanName}(${c.name}) [포지션: ${c.positions.join('/')}] [주역할군: ${c.riotClass}${subClass}] [imageId: ${c.imageId}] 난이도: ${c.difficulty} | ${desc}`;
        })
        .join('\n');
      return `[${position} 포지션]\n${list}`;
    })
    .join('\n\n');
}
