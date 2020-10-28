import { Outputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { findMoveListByUrl } from 'src/app/utils';
import { Highlight } from 'facet-mobx/facets/Highlight';

export const selectTheMoveListThatMatchesTheUrl = (navigation: Navigation) =>
  function selectTheMoveListThatMatchesTheUrl(
    moveListsCtr: MoveListsContainer
  ) {
    reaction(
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
