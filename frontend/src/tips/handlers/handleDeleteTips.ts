import { TipsStore } from 'src/tips/TipsStore';
import { apiDeleteTips } from 'src/tips/api';
import { createErrorHandler } from 'src/app/utils';

export const handleDeleteTips = (tipsStore: TipsStore, itemIds: string[]) => {
  tipsStore.removeTips(itemIds);
  apiDeleteTips(itemIds).catch(
    createErrorHandler('We could not delete the tip')
  );
};
