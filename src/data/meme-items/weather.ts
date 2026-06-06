// ⛈️ 날씨/환경 카테고리 아이템
import { MemeItem } from '@/types/meme-event';

export const WEATHER_ITEMS: MemeItem[] = [
  {
    id: 'weather_storm',
    name: '폭풍우',
    category: 'weather',
    description: '"이런 날 왜 왔지"',
    effects: [
      { type: 'hp', value: -25 },
      { type: 'buff', buffType: 'slow', duration: 15 },
    ],
  },
  {
    id: 'weather_fog',
    name: '짙은 안개',
    category: 'weather',
    description: '"앞이 안 보여"',
    effects: [
      { type: 'hp', value: -10 },
      { type: 'buff', buffType: 'confusion', uses: 3 },
    ],
  },
  {
    id: 'weather_lightning',
    name: '낙뢰',
    category: 'weather',
    description: '"우르르 쾅!"',
    effects: [{ type: 'hp', value: -30 }],
  },
  {
    id: 'weather_hail',
    name: '우박',
    category: 'weather',
    description: '"아야야야"',
    effects: [
      { type: 'hp', value: -20 },
      { type: 'buff', buffType: 'slow', duration: 10 },
    ],
  },
  {
    id: 'weather_wind',
    name: '강풍',
    category: 'weather',
    description: '"날아갈 것 같아"',
    effects: [
      { type: 'hp', value: -15 },
      { type: 'altitude', value: -50 },
    ],
  },
  {
    id: 'weather_heat',
    name: '폭염',
    category: 'weather',
    description: '"더워 죽겠다"',
    effects: [
      { type: 'hp', value: -12 },
      { type: 'buff', buffType: 'panic', duration: 10 },
    ],
  },
  {
    id: 'weather_cold',
    name: '한파',
    category: 'weather',
    description: '"손발이 꽁꽁"',
    effects: [
      { type: 'hp', value: -15 },
      { type: 'buff', buffType: 'slow', duration: 10 },
    ],
  },
  {
    id: 'weather_rain',
    name: '소나기',
    category: 'weather',
    description: '"잠깐 피하자"',
    effects: [{ type: 'hp', value: -8 }],
  },
  {
    id: 'weather_clear',
    name: '쾌청',
    category: 'weather',
    description: '"오늘 날씨 개좋다"',
    effects: [
      { type: 'hp', value: 10 },
      { type: 'buff', buffType: 'hyper', duration: 10 },
    ],
  },
  {
    id: 'weather_breeze',
    name: '시원한 바람',
    category: 'weather',
    description: '"살 것 같다"',
    effects: [{ type: 'hp', value: 12 }],
  },
  {
    id: 'weather_snow',
    name: '눈',
    category: 'weather',
    description: '"예쁘긴 한데..."',
    effects: [{ type: 'random_hp', range: [-15, 15] }],
  },
  {
    id: 'weather_rockfall',
    name: '낙석',
    category: 'weather',
    description: '"위험! 낙석주의"',
    effects: [{ type: 'hp', value: -25 }],
  },
  {
    id: 'weather_mudslide',
    name: '산사태',
    category: 'weather',
    description: '"빨리 피해!"',
    effects: [
      { type: 'hp', value: -30 },
      { type: 'buff', buffType: 'slow', duration: 20 },
    ],
  },
  {
    id: 'weather_altitude',
    name: '고산병',
    category: 'weather',
    description: '"머리가 아파..."',
    effects: [
      { type: 'hp', value: -20 },
      { type: 'buff', buffType: 'panic', duration: 15 },
    ],
  },
];
