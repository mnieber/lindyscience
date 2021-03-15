import { Labelling } from 'skandha-facets/Labelling';
import { ProfilingStore } from 'src/session/ProfilingStore';
import { UUID } from 'src/kernel/types';
import { apiSaveMoveListOrdering } from 'src/movelists/api';
import { createErrorHandler } from 'src/app/utils';

export const handleSaveLabels = (
  facet: Labelling,
  profilingStore: ProfilingStore,
  label: string,
  ids: Array<UUID>
) => {
  if (label === 'following') {
    profilingStore.setFollowedMoveListIds(ids);
    apiSaveMoveListOrdering(ids).catch(
      createErrorHandler(`Could not update the user profile`)
    );
  }
};
