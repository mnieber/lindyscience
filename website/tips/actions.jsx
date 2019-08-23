import type { UUID } from "kernel/types";
import type { TipByIdT } from "tips/types";

export function actAddTips(tips: TipByIdT) {
  return {
    type: "ADD_TIPS",
    tips,
  };
}

export function actRemoveTips(tips: Array<UUID>) {
  return {
    type: "REMOVE_TIPS",
    tips,
  };
}
