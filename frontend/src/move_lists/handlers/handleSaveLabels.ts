import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { Profiling } from 'src/session/facets/Profiling';
import { UUID } from 'src/kernel/types';
import { apiSaveMoveListOrdering } from 'src/move_lists/api';
import { createErrorHandler } from 'src/app/utils';

export const handleSaveLabels = (profiling: Profiling) => (
  ctr: MoveListsContainer
) => {
  return (label: string, ids: Array<UUID>) => {
    if (label === 'following') {
      profiling.setFollowedMoveListIds(ids);
      apiSaveMoveListOrdering(ids).catch(
        createErrorHandler(`Could not update the user profile`)
      );
    }
  };
};
