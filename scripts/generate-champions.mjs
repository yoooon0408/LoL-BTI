// scripts/generate-champions.mjs
// 데이터 드래곤에서 전체 챔피언 데이터를 가져와 data/champions.json을 생성합니다.
// 실행: npm run generate

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VERSION = '16.12.1';

// 각 챔피언의 플레이 포지션 매핑 (첫 번째가 주 포지션)
// Data Dragon champion id → position array
const POSITIONS = {
  Aatrox:       ['탑'],
  Ahri:         ['미드'],
  Akali:        ['미드', '탑'],
  Akshan:       ['미드'],
  Alistar:      ['서포터'],
  Ambessa:      ['탑'],
  Amumu:        ['정글', '서포터'],
  Anivia:       ['미드'],
  Annie:        ['미드', '서포터'],
  Aphelios:     ['원딜'],
  Ashe:         ['원딜'],
  AurelionSol:  ['미드'],
  Aurora:       ['미드', '탑'],
  Azir:         ['미드'],
  Bard:         ['서포터'],
  Belveth:      ['정글'],
  Blitzcrank:   ['서포터'],
  Brand:        ['서포터', '미드'],
  Braum:        ['서포터'],
  Briar:        ['정글'],
  Caitlyn:      ['원딜'],
  Camille:      ['탑'],
  Cassiopeia:   ['미드'],
  Chogath:      ['탑'],
  Corki:        ['미드'],
  Darius:       ['탑'],
  Diana:        ['정글', '미드'],
  Draven:       ['원딜'],
  DrMundo:      ['탑', '정글'],
  Ekko:         ['정글', '미드'],
  Elise:        ['정글'],
  Evelynn:      ['정글'],
  Ezreal:       ['원딜'],
  Fiddlesticks: ['정글'],
  Fiora:        ['탑'],
  Fizz:         ['미드'],
  Galio:        ['미드'],
  Gangplank:    ['탑'],
  Garen:        ['탑'],
  Gnar:         ['탑'],
  Gragas:       ['정글', '탑'],
  Graves:       ['정글'],
  Gwen:         ['탑'],
  Hecarim:      ['정글'],
  Heimerdinger: ['미드', '탑', '서포터'],
  Hwei:         ['미드'],
  Illaoi:       ['탑'],
  Irelia:       ['탑', '미드'],
  Ivern:        ['정글'],
  Janna:        ['서포터'],
  JarvanIV:     ['정글'],
  Jax:          ['탑', '정글'],
  Jayce:        ['탑'],
  Jhin:         ['원딜'],
  Jinx:         ['원딜'],
  Kaisa:        ['원딜'],
  Kalista:      ['원딜'],
  Karma:        ['서포터'],
  Karthus:      ['정글', '미드'],
  Kassadin:     ['미드'],
  Katarina:     ['미드'],
  Kayle:        ['탑'],
  Kayn:         ['정글'],
  Kennen:       ['탑'],
  Khazix:       ['정글'],
  Kindred:      ['정글'],
  Kled:         ['탑'],
  KogMaw:       ['원딜'],
  KSante:       ['탑'],
  Leblanc:      ['미드'],
  LeeSin:       ['정글'],
  Leona:        ['서포터'],
  Lillia:       ['정글'],
  Lissandra:    ['미드'],
  Lucian:       ['원딜'],
  Lulu:         ['서포터'],
  Lux:          ['미드', '서포터'],
  Malphite:     ['탑'],
  Malzahar:     ['미드'],
  Maokai:       ['서포터', '탑'],
  MasterYi:     ['정글'],
  Mel:          ['미드'],
  Milio:        ['서포터'],
  MissFortune:  ['원딜'],
  MonkeyKing:   ['정글', '탑'],
  Mordekaiser:  ['탑'],
  Morgana:      ['서포터'],
  Naafiri:      ['미드'],
  Nami:         ['서포터'],
  Nasus:        ['탑'],
  Nautilus:     ['서포터'],
  Neeko:        ['미드', '서포터'],
  Nidalee:      ['정글'],
  Nilah:        ['원딜'],
  Nocturne:     ['정글'],
  Nunu:         ['정글'],
  Olaf:         ['정글', '탑'],
  Orianna:      ['미드'],
  Ornn:         ['탑'],
  Pantheon:     ['서포터', '탑'],
  Poppy:        ['탑'],
  Pyke:         ['서포터'],
  Qiyana:       ['미드'],
  Quinn:        ['탑'],
  Rakan:        ['서포터'],
  Rammus:       ['정글'],
  RekSai:       ['정글'],
  Rell:         ['서포터'],
  Renata:       ['서포터'],
  Renekton:     ['탑'],
  Rengar:       ['정글', '탑'],
  Riven:        ['탑'],
  Rumble:       ['탑'],
  Ryze:         ['미드'],
  Samira:       ['원딜'],
  Sejuani:      ['정글'],
  Senna:        ['서포터', '원딜'],
  Seraphine:    ['서포터', '미드'],
  Sett:         ['탑'],
  Shaco:        ['정글'],
  Shen:         ['탑'],
  Shyvana:      ['정글'],
  Singed:       ['탑'],
  Sion:         ['탑'],
  Sivir:        ['원딜'],
  Skarner:      ['정글'],
  Smolder:      ['원딜'],
  Sona:         ['서포터'],
  Soraka:       ['서포터'],
  Swain:        ['서포터', '미드'],
  Sylas:        ['미드', '정글'],
  Syndra:       ['미드'],
  TahmKench:    ['서포터', '탑'],
  Taliyah:      ['미드', '정글'],
  Talon:        ['미드', '정글'],
  Taric:        ['서포터'],
  Teemo:        ['탑'],
  Thresh:       ['서포터'],
  Tristana:     ['원딜'],
  Trundle:      ['정글', '탑'],
  Tryndamere:   ['탑'],
  TwistedFate:  ['미드'],
  Twitch:       ['원딜'],
  Udyr:         ['정글'],
  Urgot:        ['탑'],
  Varus:        ['원딜'],
  Vayne:        ['원딜', '탑'],
  Veigar:       ['미드', '서포터'],
  VelKoz:       ['서포터', '미드'],
  Vex:          ['미드'],
  Vi:           ['정글'],
  Viego:        ['정글'],
  Viktor:       ['미드'],
  Vladimir:     ['미드', '탑'],
  Volibear:     ['정글', '탑'],
  Warwick:      ['정글'],
  Xayah:        ['원딜'],
  Xerath:       ['서포터', '미드'],
  XinZhao:      ['정글'],
  Yasuo:        ['미드'],
  Yone:         ['미드', '탑'],
  Yorick:       ['탑'],
  Yuumi:        ['서포터'],
  Zac:          ['정글'],
  Zed:          ['미드'],
  Zeri:         ['원딜'],
  Ziggs:        ['원딜', '미드'],
  Zilean:       ['서포터'],
  Zoe:          ['미드'],
  Zyra:         ['서포터'],
};

// Data Dragon 태그 → 한국어 역할군
const ROLE_MAP = {
  Fighter:   '전사',
  Tank:      '탱커',
  Mage:      '마법사',
  Assassin:  '암살자',
  Marksman:  '원거리',
  Support:   '서포터',
};

// imageId가 다른 경우 표시용 영어 이름
const DISPLAY_NAMES = {
  MonkeyKing:   'Wukong',
  Chogath:      "Cho'Gath",
  KogMaw:       "Kog'Maw",
  DrMundo:      'Dr. Mundo',
  MasterYi:     'Master Yi',
  MissFortune:  'Miss Fortune',
  TwistedFate:  'Twisted Fate',
  XinZhao:      'Xin Zhao',
  JarvanIV:     'Jarvan IV',
  AurelionSol:  'Aurelion Sol',
  LeeSin:       'Lee Sin',
  RekSai:       "Rek'Sai",
  KSante:       "K'Sante",
  VelKoz:       "Vel'Koz",
  TahmKench:    'Tahm Kench',
  Khazix:       "Kha'Zix",
  Leblanc:      'LeBlanc',
  Nunu:         'Nunu & Willump',
};

function getDifficulty(n) {
  if (n === 0) return '쉬움';
  if (n <= 3) return '매우 쉬움';
  if (n <= 5) return '쉬움';
  if (n <= 7) return '보통';
  if (n <= 9) return '어려움';
  return '매우 어려움';
}

function getGameStyle(riotClass, riotSubClass, positions) {
  if (riotClass === '서포터') return 'support';
  if (riotClass === '탱커') return 'defensive';
  if (riotClass === '암살자') return 'aggressive';
  if (riotClass === '원거리') return 'control';
  if (positions.includes('정글')) return 'aggressive';
  if (riotSubClass === '암살자') return 'aggressive';
  return 'aggressive';
}

function buildTags(riotClass, riotSubClass, difficulty, positions) {
  const tags = new Set([riotClass]);
  if (riotSubClass && riotSubClass !== riotClass) tags.add(riotSubClass);

  if (difficulty === '매우 쉬움' || difficulty === '쉬움') tags.add('입문추천');
  if (difficulty === '어려움' || difficulty === '매우 어려움') tags.add('고난이도');

  if (positions.length > 1) tags.add('멀티포지션');
  if (positions.includes('정글')) tags.add('정글러');

  return [...tags];
}

async function main() {
  console.log(`\n📥 Data Dragon v${VERSION} 에서 챔피언 데이터를 가져오는 중...`);

  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/ko_KR/champion.json`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  const result = { 탑: [], 정글: [], 미드: [], 원딜: [], 서포터: [] };
  const unmapped = [];

  for (const [id, champ] of Object.entries(json.data)) {
    const positions = POSITIONS[id];
    if (!positions) {
      unmapped.push(id);
      // 포지션이 없으면 태그 기반으로 기본 포지션 추정
      const fallbackClass = champ.tags[0];
      const fallbackPos =
        fallbackClass === 'Support' ? '서포터' :
        fallbackClass === 'Marksman' ? '원딜' :
        fallbackClass === 'Tank' ? '탑' :
        fallbackClass === 'Assassin' ? '미드' :
        '미드';
      POSITIONS[id] = [fallbackPos];
    }

    const finalPositions = POSITIONS[id];
    const riotClass = ROLE_MAP[champ.tags[0]] || '전사';
    const riotSubClass = champ.tags[1] ? (ROLE_MAP[champ.tags[1]] || null) : null;
    const difficulty = getDifficulty(champ.info.difficulty);
    const primaryPosition = finalPositions[0];

    result[primaryPosition].push({
      name: DISPLAY_NAMES[id] || id,
      koreanName: champ.name,
      imageId: id,
      positions: finalPositions,
      riotClass,
      riotSubClass,
      difficulty,
      style: [riotClass, ...(riotSubClass && riotSubClass !== riotClass ? [riotSubClass] : [])],
      gameStyle: getGameStyle(riotClass, riotSubClass, finalPositions),
      visual: [],
      setting: [],
      description: champ.blurb,
      tags: buildTags(riotClass, riotSubClass, difficulty, finalPositions),
    });
  }

  // 포지션 내 챔피언 이름순 정렬
  for (const pos of Object.keys(result)) {
    result[pos].sort((a, b) => a.koreanName.localeCompare(b.koreanName, 'ko'));
  }

  const outputPath = resolve(__dirname, '../data/champions.json');
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

  const total = Object.values(result).flat().length;

  console.log(`\n✅ data/champions.json 생성 완료 — 총 ${total}명`);
  for (const [pos, champs] of Object.entries(result)) {
    console.log(`   ${pos}: ${champs.length}명`);
  }

  if (unmapped.length > 0) {
    console.warn(`\n⚠️  포지션 미등록 챔피언 (POSITIONS 맵에 추가 필요):`);
    console.warn(`   ${unmapped.join(', ')}`);
    console.warn(`   → 임시로 태그 기반 포지션으로 배치했습니다.`);
  }
}

main().catch((err) => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
