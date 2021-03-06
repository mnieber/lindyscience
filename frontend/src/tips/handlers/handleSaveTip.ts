import { Highlight } from 'skandha-facets/Highlight';
import { TipsCtr } from 'src/tips/TipsCtr';
import { TipsStore } from 'src/tips/TipsStore';
import { apiSaveTip } from 'src/tips/api';
import { createErrorHandler } from 'src/app/utils';
import { TipT } from 'src/tips/types';
import { getf } from 'skandha';

export const handleSaveTip = (ctr: TipsCtr, tipsStore: TipsStore) =>
  function (values: any) {
    const highlight = getf(Highlight, ctr);

    const tip: TipT = {
      ...highlight.item,
      ...values,
    } as TipT;

    tipsStore.addTips({ [tip.id]: tip });
    apiSaveTip(tip).catch(createErrorHandler('We could not save the tip'));
  };
