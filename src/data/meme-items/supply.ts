// 🎒 보급품 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const SUPPLY_ITEMS: MemeItem[] = [
  {
    id: 'supply_triangle',
    name: '정상 삼각김밥',
    category: 'supply',
    description: '"편의점에서 사온 보람"',
    effects: [{ type: 'hp', value: 12 }],
  },
  {
    id: 'supply_cupnoodle',
    name: '버너 컵라면',
    category: 'supply',
    description: '"산에서 먹는 라면은 진리"',
    effects: [
      { type: 'hp', value: 18 },
      { type: 'buff', buffType: 'slow', duration: 5 },
    ],
  },
  {
    id: 'supply_choco',
    name: '초코바',
    category: 'supply',
    description: '"당 떨어질 때 필수"',
    effects: [
      { type: 'hp', value: 10 },
      { type: 'buff', buffType: 'hyper', duration: 5 },
    ],
  },
  {
    id: 'supply_ion',
    name: '이온음료',
    category: 'supply',
    description: '"전해질 보충"',
    effects: [
      { type: 'hp', value: 8 },
      { type: 'remove_debuff', removeCount: 1 },
    ],
  },
  {
    id: 'supply_gimbap',
    name: '김밥',
    category: 'supply',
    description: '"엄마가 싸준 김밥"',
    effects: [{ type: 'hp', value: 15 }],
  },
  {
    id: 'supply_egg',
    name: '삶은 계란',
    category: 'supply',
    description: '"소금 찍어서 먹기"',
    effects: [{ type: 'hp', value: 12 }],
  },
  {
    id: 'supply_makgeolli',
    name: '막걸리',
    category: 'supply',
    description: '"산에서 한 잔은 괜찮아"',
    effects: [
      { type: 'hp', value: 20 },
      { type: 'buff', buffType: 'panic', duration: 8 },
    ],
  },
  {
    id: 'supply_hotteok',
    name: '호떡',
    category: 'supply',
    description: '"산 입구 호떡집"',
    effects: [{ type: 'hp', value: 14 }],
  },
  {
    id: 'supply_walnut',
    name: '호두과자',
    category: 'supply',
    description: '"천안 휴게소 들렀다"',
    effects: [{ type: 'hp', value: 8 }],
  },
  {
    id: 'supply_americano',
    name: '텀블러 아아',
    category: 'supply',
    description: '"얼죽아는 산에서도"',
    effects: [
      { type: 'hp', value: 6 },
      { type: 'buff', buffType: 'hyper', duration: 12 },
    ],
  },
  {
    id: 'supply_energybar',
    name: '에너지바',
    category: 'supply',
    description: '"프로틴 충전"',
    effects: [
      { type: 'hp', value: 10 },
      { type: 'altitude', value: 50 },
    ],
  },
  {
    id: 'supply_banana',
    name: '바나나',
    category: 'supply',
    description: '"등산 간식 국룰"',
    effects: [{ type: 'hp', value: 10 }],
  },
  {
    id: 'supply_trail',
    name: '트레일믹스',
    category: 'supply',
    description: '"견과류 미쳤다"',
    effects: [
      { type: 'hp', value: 12 },
      { type: 'buff', buffType: 'godlife', duration: 5 },
    ],
  },
  {
    id: 'supply_water',
    name: '약수터 물',
    category: 'supply',
    description: '"이 물 ㄹㅇ 맛있다"',
    effects: [{ type: 'hp', value: 15 }],
  },
  {
    id: 'supply_dosirak',
    name: '정상 도시락',
    category: 'supply',
    description: '"정상에서 먹는 밥"',
    effects: [
      { type: 'hp', value: 25 },
      { type: 'buff', buffType: 'slow', duration: 5 },
    ],
  },
  {
    id: 'supply_soju',
    name: '정상 소주',
    category: 'supply',
    description: '"야, 경치 보면서 한 잔"',
    effects: [
      { type: 'hp', value: 22 },
      { type: 'buff', buffType: 'panic', duration: 10 },
    ],
  },
];
