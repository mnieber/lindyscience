// @flow

import { reaction } from 'src/utils/mobx_wrapper';
import { Selection } from 'src/facet-mobx/facets/selection';
import { Outputs } from 'src/screens/movelists_container/facets/outputs';
import { MoveListsContainer } from 'src/screens/movelists_container/movelists_container';
import { findMoveListByUrl } from 'src/screens/utils';
import {
  Navigation,
  ensureSelected,
} from 'src/screens/session_container/facets/navigation';

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
