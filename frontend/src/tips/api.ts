import { UUID } from 'src/kernel/types';
import { TipT } from 'src/tips/types';
import { doQuery } from 'src/app/client';

export function apiSaveTip(tip: TipT) {
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
  return doQuery(query, { ...tip });
}

export function apiDeleteTips(ids: UUID[]) {
  const query = `mutation deleteTips(
      $pks: [ID]!,
    ) {
      deleteTips(
        pks: $pks,
      ) { ok }
    }`;
  return doQuery(query, {
    pks: ids,
  });
}
