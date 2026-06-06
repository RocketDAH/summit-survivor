// ⛺ 휴식 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const REST_ITEMS: MemeItem[] = [
  {
    id: 'rest_shelter',
    name: '쉼터 발견',
    category: 'rest',
    description: '"벤치 있다!"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'buff', buffType: 'zen', duration: 5 },
    ],
  },
  {
    id: 'rest_cabin',
    name: '산장 도착',
    category: 'rest',
    description: '"따뜻한 온돌방"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'buff', buffType: 'godlife', duration: 15 },
    ],
  },
  {
    id: 'rest_tent',
    name: '텐트 설치',
    category: 'rest',
    description: '"백패킹 감성"',
    effects: [{ type: 'buff', buffType: 'zen', duration: 10 }],
  },
  {
    id: 'rest_hammock',
    name: '해먹 발견',
    category: 'rest',
    description: '"힐링 그 자체"',
    effects: [
      { type: 'hp', value: 12 },
      { type: 'buff', buffType: 'slow', duration: 8 },
    ],
  },
  {
    id: 'rest_spring',
    name: '온천 발견',
    category: 'rest',
    description: '"피로가 녹는다"',
    effects: [
      { type: 'hp', value: 30 },
      { type: 'remove_debuff', removeCount: 'all' },
    ],
  },
  {
    id: 'rest_nap',
    name: '낮잠 타임',
    category: 'rest',
    description: '"10분만..."',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'buff', buffType: 'slow', duration: 15 },
    ],
  },
  {
    id: 'rest_meditation',
    name: '명상',
    category: 'rest',
    description: '"마음을 비우고"',
    effects: [
      { type: 'hp', value: 8 },
      { type: 'buff', buffType: 'zen', duration: 8 },
    ],
  },
  {
    id: 'rest_stretch',
    name: '스트레칭',
    category: 'rest',
    description: '"근육 풀어주기"',
    effects: [
      { type: 'hp', value: 10 },
      { type: 'buff', buffType: 'hyper', duration: 8 },
    ],
  },
  {
    id: 'rest_breather',
    name: '숨 고르기',
    category: 'rest',
    description: '"후... 잠깐만"',
    effects: [{ type: 'hp', value: 5 }],
  },
  {
    id: 'rest_selfie',
    name: '인증샷 타임',
    category: 'rest',
    description: '"여기서 찍어야 해"',
    effects: [
      { type: 'hp', value: 8 },
      { type: 'buff', buffType: 'godlife', duration: 5 },
    ],
  },
  {
    id: 'rest_snacktime',
    name: '간식 타임',
    category: 'rest',
    description: '"배고프니까 쉬자"',
    effects: [{ type: 'hp', value: 12 }],
  },
  {
    id: 'rest_viewpoint',
    name: '전망대',
    category: 'rest',
    description: '"와 저기 봐!"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'altitude', value: 50 },
    ],
  },
];
