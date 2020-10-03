import { UUID } from 'src/kernel/types';
import { TipT } from 'src/tips/types';
import { doQuery } from 'src/app/client';

export function apiSaveTip(moveId: UUID, values: TipT) {
  const query = `mutation saveTip(
      $id: String!,
      $moveId: String!,
      $text: String!,
    ) {
      saveTip(
        pk: $id,
        moveId: $moveId,
        text: $text,
      ) { ok }
    }`;
  return doQuery(query, {
    ...values,
    moveId,
  });
}

export function apiDeleteTip(id: UUID) {
  const query = `mutation deleteTip(
      $id: String!,
    ) {
      deleteTip(
        pk: $id,
      ) { ok }
    }`;
  return doQuery(query, {
    id,
  });
}
