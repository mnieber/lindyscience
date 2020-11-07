import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NavigateToMoveListEffect } from 'src/app/containers/NavigateToMoveListEffect';
import { NavigateToMoveEffect } from 'src/app/containers/NavigateToMoveEffect';
import { MoveListFrame } from 'src/move_lists/containers/MoveListFrame';
import { CutVideoCtrProvider } from 'src/video/CutVideoCtrProvider';
import { MoveListDetailsPage } from 'src/move_lists/containers/MoveListDetailsPage';
import { MovePage } from 'src/moves/containers/MovePage';

export const ListsSwitch = () => {
  return (
    <MoveListFrame>
      <Switch>
        <Route exact path="/lists/:ownerUsername/:moveListSlug">
          <NavigateToMoveListEffect />
          <CutVideoCtrProvider>
            <MoveListDetailsPage />
          </CutVideoCtrProvider>
        </Route>
        <Route
          exact
          path={[
            '/lists/:ownerUsername/:moveListSlug/:moveSlug',
            '/lists/:ownerUsername/:moveListSlug/:moveSlug/:moveId',
          ]}
        >
          <NavigateToMoveEffect />
          <MovePage />
        </Route>
      </Switch>
    </MoveListFrame>
  );
};
