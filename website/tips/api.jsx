import { doQuery } from "app/client";

import type { TipT } from "tips/types";
import type { UUID } from "kernel/types";

export function apiSaveTip(moveId: UUID, values: TipT) {
  return doQuery(
    `mutation saveTip(
      $id: String!,
      $moveId: String!,
      $text: String!,
    ) {
      saveTip(
        pk: $id,
        moveId: $moveId,
        text: $text,
      ) { ok }
    }`,
    {
      ...values,
      moveId,
    }
  );
}

export function apiDeleteTip(id: UUID) {
  return doQuery(
    `mutation deleteTip(
      $id: String!,
    ) {
      deleteTip(
        pk: $id,
      ) { ok }
    }`,
    {
      id,
    }
  );
}
