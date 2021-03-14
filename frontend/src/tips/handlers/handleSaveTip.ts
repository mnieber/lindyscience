import { Highlight } from 'facility-facets/Highlight';
import { TipsCtr } from 'src/tips/TipsCtr';
import { TipsStore } from 'src/tips/TipsStore';
import { apiSaveTip } from 'src/tips/api';
import { createErrorHandler } from 'src/app/utils';
import { TipT } from 'src/tips/types';

export const handleSaveTip = (ctr: TipsCtr, tipsStore: TipsStore) =>
  function (values: any) {
    const highlight = Highlight.get(ctr);

    const tip: TipT = {
      ...highlight.item,
      ...values,
    } as TipT;

    tipsStore.addTips({ [tip.id]: tip });
    apiSaveTip(tip).catch(createErrorHandler('We could not save the tip'));
  };
