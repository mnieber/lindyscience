import { Highlight } from 'facet-mobx/facets/highlight';
import { TipsCtr } from 'src/tips/TipsCtr';
import { Inputs } from 'src/tips/facets/Inputs';
import { TipsStore } from 'src/tips/TipsStore';
import { apiSaveTip } from 'src/tips/api';
import { createErrorHandler } from 'src/app/utils';
import { TipT } from 'src/tips/types';

export const handleSaveTip = (ctr: TipsCtr, tipsStore: TipsStore) => (
  values: any
) => {
  const highlight = Highlight.get(ctr);
  const inputs = Inputs.get(ctr);

  const tip: TipT = {
    ...highlight.item,
    ...values,
  } as TipT;

  if (!inputs.move) {
    throw Error('No move');
  }

  tipsStore.addTips({ [tip.id]: tip });
  apiSaveTip(inputs.move.id, tip).catch(
    createErrorHandler('We could not save the tip')
  );
};
