import type { CropPassport, JourneyStageId } from "./types";
import { daysSinceHarvest, freshnessKey } from "./market";

export const journeyOrder: JourneyStageId[] = [
  "seed",
  "growing",
  "flowering",
  "harvested",
  "packed",
  "shipped",
  "delivered",
];

export function stageIndex(id: JourneyStageId) {
  return journeyOrder.indexOf(id);
}

export function freshnessOf(p: CropPassport) {
  return freshnessKey(daysSinceHarvest(p.harvestedOn));
}

export function fertilizerOf(p: CropPassport) {
  return p.fertilizer || p.inputs.map((i) => i.name).join(" · ");
}
