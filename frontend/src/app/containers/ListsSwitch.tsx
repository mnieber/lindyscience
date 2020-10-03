import React from 'react';
import { compose } from 'rambda';
import { Route, Switch } from 'react-router-dom';

import {
  withMoveListTarget,
  withMoveTarget,
} from 'src/app/containers/RouteEffects';
import { MoveListFrame } from 'src/move_lists/containers/MoveListFrame';
import { CutVideoCtrProvider } from 'src/video/CutVideoCtrProvider';
import { MoveListDetailsPage } from 'src/move_lists/containers/MoveListDetailsPage';
import { MoveCtrProvider } from 'src/moves/MoveCtr/MoveCtrProvider';
import { MovePage } from 'src/moves/containers/MovePage';

export const ListsSwitch = () => {
  return (
    <MoveListFrame>
      <Switch>
        <Route exact path="/lists/:ownerUsername/:moveListSlug">
          {compose(withMoveListTarget)(() => (
            <CutVideoCtrProvider>
              <MoveListDetailsPage />
            </CutVideoCtrProvider>
          ))}
        </Route>
        <Route
          exact
          path={[
            '/lists/:ownerUsername/:moveListSlug/:moveSlug',
            '/lists/:ownerUsername/:moveListSlug/:moveSlug/:moveId',
          ]}
        >
          {compose(withMoveTarget)(() => (
            <MoveCtrProvider>
              <MovePage />
            </MoveCtrProvider>
          ))}
        </Route>
      </Switch>
    </MoveListFrame>
  );
};
