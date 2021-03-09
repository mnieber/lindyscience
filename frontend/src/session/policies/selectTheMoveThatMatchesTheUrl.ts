import { Outputs } from 'src/moves/MovesCtr/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { declareReaction } from 'facility-mobx';
import { findMoveBySlugid } from 'src/app/utils';
import { Highlight } from 'facility-mobx/facets/Highlight';

export const syncMoveWithCurrentUrl = (navigation: Navigation) =>
  function syncMoveWithCurrentUrl(movesCtr: MovesContainer) {
    declareReaction(
      movesCtr,
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
      }
    );
  };
