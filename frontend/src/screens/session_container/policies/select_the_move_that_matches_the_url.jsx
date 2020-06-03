// @flow

import { reaction } from 'src/utils/mobx_wrapper';
import { listen } from 'src/facet';
import { Addition } from 'src/facet-mobx/facets/addition';
import { Selection } from 'src/facet-mobx/facets/selection';
import { findMoveBySlugid } from 'src/screens/utils';
import { Outputs } from 'src/screens/moves_container/facets/outputs';
import { MovesContainer } from 'src/screens/moves_container/moves_container';
import {
  Navigation,
  ensureSelected,
} from 'src/screens/session_container/facets/navigation';

export const syncMoveWithCurrentUrl = (navigation: Navigation) =>
  function syncMoveWithCurrentUrl(movesCtr: MovesContainer) {
    reaction(
      () => {
        const addition = Addition.get(movesCtr);
        const outputs = Outputs.get(movesCtr);
        return navigation.dataRequest.moveSlugid && !addition.item
          ? findMoveBySlugid(outputs.preview, navigation.dataRequest.moveSlugid)
          : undefined;
      },
      (moveMatchingUrl) => {
        if (moveMatchingUrl) {
          ensureSelected(Selection.get(movesCtr), moveMatchingUrl.id);
        }
      },
      {
        name: 'syncMoveWithCurrentUrl',
      }
    );
  };

export const syncUrlWithNewMove = (navigation: Navigation) => (
  movesCtr: MovesContainer
) => {
  const addition = Addition.get(movesCtr);

  listen(addition, 'add', () => {
    if (addition.item) {
      navigation.navigateToMove(addition.item);
    }
  });
};
