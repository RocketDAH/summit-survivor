// 🧗 도전 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const CHALLENGE_ITEMS: MemeItem[] = [
  {
    id: 'challenge_cliff',
    name: '암벽 구간',
    category: 'challenge',
    description: '"손잡이 어디야"',
    effects: [
      { type: 'hp', value: -15 },
      { type: 'altitude', value: 250 },
    ],
  },
  {
    id: 'challenge_steep',
    name: '급경사',
    category: 'challenge',
    description: '"계단이 끝이 없어"',
    effects: [
      { type: 'hp', value: -10 },
      { type: 'altitude', value: 200 },
    ],
  },
  {
    id: 'challenge_shortcut',
    name: '숏컷',
    category: 'challenge',
    description: '"샛길 발견... 맞나?"',
    effects: [
      { type: 'random_hp', range: [-30, 30] },
      { type: 'altitude', value: 300 },
    ],
  },
  {
    id: 'challenge_rope',
    name: '로프 구간',
    category: 'challenge',
    description: '"잡고 올라가"',
    effects: [
      { type: 'hp', value: -8 },
      { type: 'altitude', value: 150 },
    ],
  },
  {
    id: 'challenge_boulder',
    name: '바위 넘기',
    category: 'challenge',
    description: '"엉덩이가 아파"',
    effects: [
      { type: 'hp', value: -12 },
      { type: 'altitude', value: 180 },
    ],
  },
  {
    id: 'challenge_stream',
    name: '계곡 건너기',
    category: 'challenge',
    description: '"물 차가워!"',
    effects: [{ type: 'random_hp', range: [-20, 20] }],
  },
  {
    id: 'challenge_night',
    name: '야간 산행',
    category: 'challenge',
    description: '"헤드랜턴 필수"',
    effects: [
      { type: 'hp', value: -10 },
      { type: 'altitude', value: 200 },
      { type: 'buff', buffType: 'panic', duration: 10 },
    ],
  },
  {
    id: 'challenge_sprint',
    name: '스퍼트',
    category: 'challenge',
    description: '"뛰어간다!"',
    effects: [
      { type: 'hp', value: -20 },
      { type: 'altitude', value: 350 },
      { type: 'buff', buffType: 'hyper', duration: 10 },
    ],
  },
  {
    id: 'challenge_detour',
    name: '우회로',
    category: 'challenge',
    description: '"돌아가자..."',
    effects: [
      { type: 'hp', value: 10 },
      { type: 'altitude', value: -100 },
    ],
  },
  {
    id: 'challenge_push',
    name: '한계 돌파',
    category: 'challenge',
    description: '"가보자고!"',
    effects: [
      { type: 'hp', value: -25 },
      { type: 'altitude', value: 400 },
      { type: 'buff', buffType: 'godlife', duration: 15 },
    ],
  },
  {
    id: 'challenge_crawl',
    name: '기어가기',
    category: 'challenge',
    description: '"좁은 길"',
    effects: [
      { type: 'hp', value: -5 },
      { type: 'altitude', value: 100 },
    ],
  },
  {
    id: 'challenge_jump',
    name: '점프',
    category: 'challenge',
    description: '"뛰어!!!"',
    effects: [
      { type: 'random_hp', range: [-25, 25] },
      { type: 'altitude', value: 150 },
    ],
  },
  {
    id: 'challenge_climb',
    name: '철계단',
    category: 'challenge',
    description: '"높아서 무서워"',
    effects: [
      { type: 'hp', value: -8 },
      { type: 'altitude', value: 200 },
    ],
  },
  {
    id: 'challenge_ridge',
    name: '칼바위 능선',
    category: 'challenge',
    description: '"조심조심"',
    effects: [
      { type: 'hp', value: -20 },
      { type: 'altitude', value: 300 },
    ],
  },
];
