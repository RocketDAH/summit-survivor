// 📱 유혹/방해 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const TEMPTATION_ITEMS: MemeItem[] = [
  {
    id: 'tempt_sns',
    name: 'SNS 알림',
    category: 'temptation',
    description: '"잠깐만 확인..."',
    effects: [
      { type: 'hp', value: -10 },
      { type: 'buff', buffType: 'slow', duration: 10 },
    ],
  },
  {
    id: 'tempt_youtube',
    name: '유튜브 쇼츠',
    category: 'temptation',
    description: '"이 영상만..."',
    effects: [{ type: 'hp', value: -15 }],
  },
  {
    id: 'tempt_call',
    name: '회사 전화',
    category: 'temptation',
    description: '"네? 지금요?"',
    effects: [
      { type: 'hp', value: -20 },
      { type: 'buff', buffType: 'panic', duration: 10 },
    ],
  },
  {
    id: 'tempt_down',
    name: '하산 충동',
    category: 'temptation',
    description: '"그냥 내려갈까"',
    effects: [
      { type: 'hp', value: -8 },
      { type: 'altitude', value: -100 },
    ],
  },
  {
    id: 'tempt_shortcut_fail',
    name: '잘못된 길',
    category: 'temptation',
    description: '"여기 아닌데?"',
    effects: [
      { type: 'hp', value: -15 },
      { type: 'altitude', value: -150 },
    ],
  },
  {
    id: 'tempt_taxi',
    name: '케이블카 유혹',
    category: 'temptation',
    description: '"걸어야지..."',
    effects: [
      { type: 'hp', value: -5 },
      { type: 'altitude', value: 200 },
    ],
  },
  {
    id: 'tempt_group',
    name: '단체팀 뒤따라가기',
    category: 'temptation',
    description: '"저 팀 느려..."',
    effects: [
      { type: 'altitude', value: 50 },
      { type: 'buff', buffType: 'slow', duration: 15 },
    ],
  },
  {
    id: 'tempt_selfie',
    name: '셀카 중독',
    category: 'temptation',
    description: '"여기서도 찍어야지"',
    effects: [
      { type: 'hp', value: -5 },
      { type: 'buff', buffType: 'slow', duration: 8 },
    ],
  },
  {
    id: 'tempt_rest',
    name: '과한 휴식',
    category: 'temptation',
    description: '"조금만 더 쉴래"',
    effects: [
      { type: 'hp', value: 8 },
      { type: 'altitude', value: -80 },
    ],
  },
  {
    id: 'tempt_food',
    name: '맛집 생각',
    category: 'temptation',
    description: '"하산하면 뭐 먹지"',
    effects: [{ type: 'hp', value: -10 }],
  },
  {
    id: 'tempt_quit',
    name: '포기의 유혹',
    category: 'temptation',
    description: '"왜 왔지..."',
    effects: [{ type: 'hp', value: -30 }],
  },
  {
    id: 'tempt_brag',
    name: '자랑글 쓰기',
    category: 'temptation',
    description: '"등산 완료 ✓"',
    effects: [
      { type: 'hp', value: -5 },
      { type: 'buff', buffType: 'slow', duration: 5 },
      { type: 'buff', buffType: 'godlife', duration: 5 },
    ],
  },
  {
    id: 'tempt_compare',
    name: '다른 등산객 비교',
    category: 'temptation',
    description: '"쟤는 왜 저렇게 빨라"',
    effects: [
      { type: 'hp', value: -8 },
      { type: 'buff', buffType: 'hyper', duration: 5 },
    ],
  },
  {
    id: 'tempt_battery',
    name: '배터리 부족',
    category: 'temptation',
    description: '"10% 남았어..."',
    effects: [
      { type: 'hp', value: -12 },
      { type: 'buff', buffType: 'panic', duration: 8 },
    ],
  },
];
