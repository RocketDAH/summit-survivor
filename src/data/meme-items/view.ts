// 🌄 절경 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const VIEW_ITEMS: MemeItem[] = [
  {
    id: 'view_sunrise',
    name: '일출',
    category: 'view',
    description: '"새벽부터 올라온 보람"',
    effects: [
      { type: 'hp', value: 35 },
      { type: 'buff', buffType: 'godlife', duration: 20 },
    ],
  },
  {
    id: 'view_sunset',
    name: '일몰',
    category: 'view',
    description: '"하산 전 선물"',
    effects: [
      { type: 'hp', value: 30 },
      { type: 'buff', buffType: 'zen', duration: 15 },
    ],
  },
  {
    id: 'view_clouds',
    name: '운해',
    category: 'view',
    description: '"구름 위를 걷는 기분"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'buff', buffType: 'godlife', duration: 15 },
    ],
  },
  {
    id: 'view_peak',
    name: '정상 도착',
    category: 'view',
    description: '"왔다!!!"',
    effects: [{ type: 'hp', value: 50 }],
  },
  {
    id: 'view_rainbow',
    name: '무지개',
    category: 'view',
    description: '"행운의 징조"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'buff', buffType: 'lucky', uses: 1 },
    ],
  },
  {
    id: 'view_wildlife',
    name: '야생동물 발견',
    category: 'view',
    description: '"다람쥐다!!"',
    effects: [{ type: 'hp', value: 15 }],
  },
  {
    id: 'view_flowers',
    name: '야생화 군락',
    category: 'view',
    description: '"꽃길만 걷자"',
    effects: [
      { type: 'hp', value: 18 },
      { type: 'buff', buffType: 'godlife', duration: 10 },
    ],
  },
  {
    id: 'view_snow',
    name: '설경',
    category: 'view',
    description: '"겨울 산의 매력"',
    effects: [{ type: 'hp', value: 22 }],
  },
  {
    id: 'view_stargazing',
    name: '별 관측',
    category: 'view',
    description: '"은하수다..."',
    effects: [
      { type: 'hp', value: 28 },
      { type: 'buff', buffType: 'zen', duration: 10 },
    ],
  },
  {
    id: 'view_waterfall',
    name: '폭포 발견',
    category: 'view',
    description: '"시원하다!"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'remove_debuff', removeCount: 1 },
    ],
  },
  {
    id: 'view_ridge',
    name: '능선 도착',
    category: 'view',
    description: '"여기서부터 내리막"',
    effects: [
      { type: 'hp', value: 15 },
      { type: 'altitude', value: 100 },
    ],
  },
  {
    id: 'view_photo',
    name: '인생샷 건짐',
    category: 'view',
    description: '"이건 프사감"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'buff', buffType: 'godlife', duration: 10 },
    ],
  },
];
