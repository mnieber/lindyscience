import { Outputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { declareReaction } from 'facility-mobx';
import { findMoveListByUrl } from 'src/app/utils';
import { Highlight } from 'facility-mobx/facets/Highlight';

export const selectTheMoveListThatMatchesTheUrl = (navigation: Navigation) =>
  function selectTheMoveListThatMatchesTheUrl(
    moveListsCtr: MoveListsContainer
  ) {
    declareReaction(
      moveListsCtr,
      () => {
        const outputs = Outputs.get(moveListsCtr);
        return navigation.dataRequest.moveListUrl
          ? findMoveListByUrl(
              outputs.display,
              navigation.dataRequest.moveListUrl
            )
          : undefined;
      },
      (moveListMatchingUrl) => {
        if (moveListMatchingUrl) {
          Highlight.get(moveListsCtr).highlightItem(moveListMatchingUrl.id);
        }
      },
      {
        name: 'selectTheMoveListThatMatchesTheUrl',
      }
    );
  };
