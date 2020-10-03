import { Outputs } from 'src/move_lists/facets/Outputs';
import { Navigation, ensureSelected } from 'src/session/facets/Navigation';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { findMoveListByUrl } from 'src/app/utils';
import { Selection } from 'src/npm/facet-mobx/facets/selection';

export const selectTheMoveListThatMatchesTheUrl = (navigation: Navigation) =>
  function selectTheMoveListThatMatchesTheUrl(
    moveListsCtr: MoveListsContainer
  ) {
    reaction(
      () => {
        const outputs = Outputs.get(moveListsCtr);
        return navigation.dataRequest.moveListUrl
          ? findMoveListByUrl(
              outputs.preview,
              navigation.dataRequest.moveListUrl
            )
          : undefined;
      },
      (moveListMatchingUrl) => {
        if (moveListMatchingUrl) {
          ensureSelected(Selection.get(moveListsCtr), moveListMatchingUrl.id);
        }
      },
      {
        name: 'selectTheMoveListThatMatchesTheUrl',
      }
    );
  };
