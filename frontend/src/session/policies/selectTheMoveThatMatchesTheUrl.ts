import { Outputs } from 'src/moves/MovesCtr/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { findMoveBySlugid } from 'src/app/utils';
import { listen } from 'facet';
import { Addition } from 'facet-mobx/facets/Addition';
import { Highlight } from 'facet-mobx/facets/Highlight';

export const syncMoveWithCurrentUrl = (navigation: Navigation) =>
  function syncMoveWithCurrentUrl(movesCtr: MovesContainer) {
    reaction(
      () => {
        const outputs = Outputs.get(movesCtr);
        return navigation.dataRequest.moveSlugid
          ? findMoveBySlugid(outputs.preview, navigation.dataRequest.moveSlugid)
          : undefined;
      },
      (moveMatchingUrl) => {
        if (moveMatchingUrl) {
          Highlight.get(movesCtr).highlightItem(moveMatchingUrl.id);
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
