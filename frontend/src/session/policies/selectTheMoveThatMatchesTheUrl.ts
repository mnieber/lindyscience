import { Outputs } from 'src/moves/MovesCtr/facets/Outputs';
import { Navigation, ensureSelected } from 'src/session/facets/Navigation';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { findMoveBySlugid } from 'src/app/utils';
import { listen } from 'facet';
import { Addition } from 'facet-mobx/facets/addition';
import { Selection } from 'facet-mobx/facets/selection';

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
