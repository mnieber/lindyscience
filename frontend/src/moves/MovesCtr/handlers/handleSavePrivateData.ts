import { EditingPrivateData } from 'src/moves/MovesCtr/facets/EditingPrivateData';
import { Highlight } from 'facility-facets/Highlight';
import { MovesStore } from 'src/moves/MovesStore';
import { getCtr } from 'facility';
import { createErrorHandler } from 'src/app/utils';
import { apiSaveMovePrivateData } from 'src/moves/api';

export const handleSavePrivateData = (
  facet: EditingPrivateData,
  movesStore: MovesStore,
  values: any
) => {
  const ctr = getCtr(facet);
  const move = Highlight.get(ctr).item;
  const movePrivateData = movesStore.getOrCreatePrivateData(move.id);
  const mpd = {
    ...movePrivateData,
    ...values,
  };

  movesStore.addMovePrivateDatas({
    [movePrivateData.moveId]: mpd,
  });
  apiSaveMovePrivateData(mpd).catch(
    createErrorHandler('We could not update your private data for this move')
  );
};
