// 👥 만남/동료 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const MEET_ITEMS: MemeItem[] = [
  {
    id: 'meet_veteran',
    name: '산악회 선배',
    category: 'meet',
    description: '"이쪽으로 오세요"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'altitude', value: 100 },
    ],
  },
  {
    id: 'meet_guide',
    name: '전문 가이드',
    category: 'meet',
    description: '"제가 안내할게요"',
    effects: [
      { type: 'buff', buffType: 'shield', uses: 2 },
      { type: 'altitude', value: 150 },
    ],
  },
  {
    id: 'meet_group',
    name: '등산 모임 합류',
    category: 'meet',
    description: '"같이 가요!"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'buff', buffType: 'hyper', duration: 15 },
    ],
  },
  {
    id: 'meet_stranger',
    name: '먼저 인사',
    category: 'meet',
    description: '"안녕하세요~"',
    effects: [{ type: 'hp', value: 10 }],
  },
  {
    id: 'meet_dog',
    name: '등산 강아지',
    category: 'meet',
    description: '"귀여워!!!"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'buff', buffType: 'godlife', duration: 10 },
    ],
  },
  {
    id: 'meet_celebrity',
    name: '연예인 발견',
    category: 'meet',
    description: '"저거 OOO 아니야?"',
    effects: [{ type: 'hp', value: 30 }],
  },
  {
    id: 'meet_foreigner',
    name: '외국인 등산객',
    category: 'meet',
    description: '"Where are you from?"',
    effects: [
      { type: 'hp', value: 12 },
      { type: 'buff', buffType: 'godlife', duration: 8 },
    ],
  },
  {
    id: 'meet_couple',
    name: '커플 등산객',
    category: 'meet',
    description: '"부럽다/안 부러워"',
    effects: [{ type: 'random_hp', range: [-15, 15] }],
  },
  {
    id: 'meet_kid',
    name: '어린이 등산객',
    category: 'meet',
    description: '"나도 저렇게 뛰어야지"',
    effects: [
      { type: 'hp', value: 10 },
      { type: 'buff', buffType: 'hyper', duration: 10 },
    ],
  },
  {
    id: 'meet_senior',
    name: '어르신 등산객',
    category: 'meet',
    description: '"대단하시다..."',
    effects: [{ type: 'hp', value: 18 }],
  },
  {
    id: 'meet_youtuber',
    name: '등산 유튜버',
    category: 'meet',
    description: '"구독 좋아요"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'buff', buffType: 'lucky', uses: 1 },
    ],
  },
  {
    id: 'meet_rescue',
    name: '산악 구조대',
    category: 'meet',
    description: '"든든하다"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'buff', buffType: 'shield', uses: 1 },
    ],
  },
];
