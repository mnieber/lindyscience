// @flow

import { Inputs } from 'src/moves/MovesCtr/facets/Inputs';
import { Outputs } from 'src/moves/MovesCtr/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import type { MoveT } from 'src/moves/types';
import { makeSlugid, makeSlugidMatcher } from 'src/app/utils';
import { getId } from 'src/app/utils';
import { browseToMoveUrl } from 'src/app/containers';
import { listen } from 'src/npm/facet';

export const handleNavigateToMove = (navigation: Navigation) => (
  movesCtr: MovesContainer
) => {
  listen(navigation, 'navigateToMove', (move: MoveT) => {
    const moveList = Inputs.get(movesCtr).moveList;
    const outputs = Outputs.get(movesCtr);
    const moveSlugid = makeSlugid(move.slug, move.id);
    const moveListUrl = moveList
      ? moveList.ownerUsername + '/' + moveList.slug
      : '';

    // We need this to prevent a stale value of
    // navigation.moveListUrl (in this function, we are
    // effectively setting a new value of navigation.moveListUrl)
    navigation.requestData({
      moveSlugid,
      moveListUrl,
    });

    const isSlugUnique =
      outputs.preview.filter(makeSlugidMatcher(move.slug)).length <= 1;
    const maybeMoveId = isSlugUnique ? '' : getId(move);
    browseToMoveUrl(
      navigation.history.push,
      [moveListUrl, move.slug, maybeMoveId],
      true
    );
  });
};
