// 🥾 장비 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const GEAR_ITEMS: MemeItem[] = [
  {
    id: 'gear_stick',
    name: '등산스틱',
    category: 'gear',
    description: '"무릎 지켜"',
    effects: [
      { type: 'altitude', value: 100 },
      { type: 'buff', buffType: 'shield', uses: 1 },
    ],
  },
  {
    id: 'gear_crampon',
    name: '아이젠',
    category: 'gear',
    description: '"미끄러움 방지"',
    effects: [
      { type: 'altitude', value: 150 },
      { type: 'buff', buffType: 'shield', uses: 1 },
    ],
  },
  {
    id: 'gear_goretex',
    name: '고어텍스',
    category: 'gear',
    description: '"비 와도 OK"',
    effects: [
      { type: 'buff', buffType: 'shield', uses: 1 },
      { type: 'buff', buffType: 'godlife', duration: 20 },
    ],
  },
  {
    id: 'gear_headlamp',
    name: '헤드랜턴',
    category: 'gear',
    description: '"어두워도 간다"',
    effects: [
      { type: 'buff', buffType: 'hyper', duration: 15 },
      { type: 'altitude', value: 100 },
    ],
  },
  {
    id: 'gear_gloves',
    name: '등산장갑',
    category: 'gear',
    description: '"손 보호"',
    effects: [
      { type: 'hp', value: 8 },
      { type: 'buff', buffType: 'shield', uses: 1 },
    ],
  },
  {
    id: 'gear_backpack',
    name: '경량배낭',
    category: 'gear',
    description: '"가볍게 가자"',
    effects: [{ type: 'buff', buffType: 'hyper', duration: 20 }],
  },
  {
    id: 'gear_boots',
    name: '등산화',
    category: 'gear',
    description: '"발이 편해야 산이 보인다"',
    effects: [{ type: 'altitude', value: 120 }],
  },
  {
    id: 'gear_windbreaker',
    name: '윈드브레이커',
    category: 'gear',
    description: '"바람 막아줌"',
    effects: [{ type: 'buff', buffType: 'shield', uses: 2 }],
  },
  {
    id: 'gear_gps',
    name: 'GPS 시계',
    category: 'gear',
    description: '"길 안 잃어"',
    effects: [{ type: 'special', specialId: 'hint_3' }],
  },
  {
    id: 'gear_firstaid',
    name: '구급키트',
    category: 'gear',
    description: '"상비약 필수"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'remove_debuff', removeCount: 1 },
    ],
  },
  {
    id: 'gear_sunscreen',
    name: '선크림',
    category: 'gear',
    description: '"자외선 차단"',
    effects: [
      { type: 'buff', buffType: 'shield', uses: 1 },
      { type: 'hp', value: 5 },
    ],
  },
  {
    id: 'gear_thermos',
    name: '보온병',
    category: 'gear',
    description: '"따뜻한 거 마시자"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'buff', buffType: 'hyper', duration: 8 },
    ],
  },
  {
    id: 'gear_drybag',
    name: '방수팩',
    category: 'gear',
    description: '"습기 OUT"',
    effects: [{ type: 'buff', buffType: 'shield', uses: 1 }],
  },
  {
    id: 'gear_trekking',
    name: '트레킹화',
    category: 'gear',
    description: '"가볍게 가볍게"',
    effects: [
      { type: 'altitude', value: 80 },
      { type: 'hp', value: 5 },
    ],
  },
];
