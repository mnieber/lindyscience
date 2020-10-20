import { TipsStore } from 'src/tips/TipsStore';
import { TipsCtr } from 'src/tips/TipsCtr';
import { apiDeleteTips } from 'src/tips/api';
import { createErrorHandler } from 'src/app/utils';

export const handleDeleteTips = (ctr: TipsCtr, tipsStore: TipsStore) => {
  return (itemIds: string[]) => {
    tipsStore.removeTips(itemIds);
    apiDeleteTips(itemIds).catch(
      createErrorHandler('We could not delete the tip')
    );
  };
};
