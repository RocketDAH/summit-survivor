// 🎭 밈/감정 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const MEME_ITEMS: MemeItem[] = [
  {
    id: 'meme_gaboja',
    name: '가보자고',
    category: 'meme',
    description: '"일단 가보자고!"',
    effects: [{ type: 'altitude', value: 250 }],
  },
  {
    id: 'meme_muya',
    name: '무야호~',
    category: 'meme',
    description: '"정상에서 외치기"',
    effects: [{ type: 'hp', value: 35 }],
  },
  {
    id: 'meme_kingbad',
    name: '킹받네',
    category: 'meme',
    description: '"분노 에너지"',
    effects: [
      { type: 'hp', value: -5 },
      { type: 'buff', buffType: 'hyper', duration: 15 },
    ],
  },
  {
    id: 'meme_real',
    name: '실화냐',
    category: 'meme',
    description: '"이게 된다고?"',
    effects: [{ type: 'buff', buffType: 'frenzy', duration: 10 }],
  },
  {
    id: 'meme_legend',
    name: '레전드',
    category: 'meme',
    description: '"역대급 등산"',
    effects: [
      { type: 'hp', value: 50 },
      { type: 'buff', buffType: 'godlife', duration: 15 },
    ],
  },
  {
    id: 'meme_yolo',
    name: '욜로',
    category: 'meme',
    description: '"한 번 사는 인생"',
    effects: [
      { type: 'buff', buffType: 'frenzy', duration: 15 },
      { type: 'hp', value: 20 },
    ],
  },
  {
    id: 'meme_goat',
    name: 'GOAT',
    category: 'meme',
    description: '"오늘의 등산왕"',
    effects: [{ type: 'hp', value: 45 }],
  },
  {
    id: 'meme_flex',
    name: '정상 플렉스',
    category: 'meme',
    description: '"정상 왔다 인증"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'altitude', value: 150 },
    ],
  },
  {
    id: 'meme_touch',
    name: '터치 그라스',
    category: 'meme',
    description: '"자연과 하나됨"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'buff', buffType: 'godlife', duration: 10 },
    ],
  },
  {
    id: 'meme_therapy',
    name: '등산 테라피',
    category: 'meme',
    description: '"산이 치료해줘"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'remove_debuff', removeCount: 'all' },
    ],
  },
  {
    id: 'meme_achievement',
    name: '업적 달성',
    category: 'meme',
    description: '"오늘도 오운완"',
    effects: [{ type: 'hp', value: 30 }],
  },
  {
    id: 'meme_main',
    name: '주인공 각성',
    category: 'meme',
    description: '"내가 이 산의 주인공"',
    effects: [
      { type: 'buff', buffType: 'hyper', duration: 20 },
      { type: 'buff', buffType: 'shield', uses: 1 },
    ],
  },
  {
    id: 'meme_slay',
    name: '슬레이',
    category: 'meme',
    description: '"오늘 나 미쳤어"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'buff', buffType: 'hyper', duration: 8 },
    ],
  },
  {
    id: 'meme_chill',
    name: '칠해',
    category: 'meme',
    description: '"급할 거 없어"',
    effects: [{ type: 'buff', buffType: 'zen', duration: 10 }],
  },
  {
    id: 'meme_respect',
    name: '리스펙',
    category: 'meme',
    description: '"산아 고마워"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'buff', buffType: 'godlife', duration: 10 },
    ],
  },
];
