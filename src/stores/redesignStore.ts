// 리디자인 스토어 — 슬라이스 "조합"만 담당. (거의 안 바뀌는 파일)
//
// 새 슬라이스를 추가할 때만 이 파일을 건드립니다. 그 외 로직은 각 슬라이스 파일에서.
// 슬라이스 패턴: 각 createXxxSlice 는 (set,get,store)=>({...}) 이고, 여기서 spread 로 합칩니다.
import { create } from "zustand";
import type { RedesignStore } from "@/types/redesign";
import { createClimbSlice } from "./slices/climbSlice";
import { createEquipmentSlice } from "./slices/equipmentSlice";
import { createHazardSlice } from "./slices/hazardSlice";
import { createConsumableSlice } from "./slices/consumableSlice";
import { createChoiceSlice } from "./slices/choiceSlice";
import { createMetaSlice } from "./slices/metaSlice";

export const useRedesignStore = create<RedesignStore>()((...a) => ({
  ...createClimbSlice(...a),
  ...createEquipmentSlice(...a),
  ...createHazardSlice(...a),
  ...createConsumableSlice(...a),
  ...createChoiceSlice(...a),
  ...createMetaSlice(...a),
}));
