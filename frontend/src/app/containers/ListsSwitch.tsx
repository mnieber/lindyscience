import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LoadMoveListEffect } from 'src/move_lists/components/NavigateToMoveListEffect';
import { SelectMoveListEffect } from 'src/move_lists/components/SelectMoveListEffect';
import { SelectMoveEffect } from 'src/move_lists/components/SelectMoveEffect';
import { LoadMoveEffect } from 'src/moves/components/NavigateToMoveEffect';
import { MoveListFrame } from 'src/move_lists/containers/MoveListFrame';
import { CutVideoCtrProvider } from 'src/video/CutVideoCtrProvider';
import { MoveListDetailsPage } from 'src/move_lists/containers/MoveListDetailsPage';
import { MovePage } from 'src/moves/containers/MovePage';
import { MoveCtrProvider } from 'src/moves/MoveCtr/MoveCtrProvider';
import { TipsCtrProvider } from 'src/tips/TipsCtrProvider';

export const ListsSwitch = () => {
  return (
    <Route path="/lists/:ownerUsername/:moveListSlug">
      <LoadMoveListEffect />
      <SelectMoveListEffect />
      <MoveListFrame>
        <Switch>
          <Route exact path="/lists/:ownerUsername/:moveListSlug">
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
            <LoadMoveEffect />
            <SelectMoveEffect />
            <MoveCtrProvider ctrKey="globalMoveCtr">
              <TipsCtrProvider ctrKey="globalTipsCtr">
                <MovePage />
              </TipsCtrProvider>
            </MoveCtrProvider>
          </Route>
        </Switch>
      </MoveListFrame>
    </Route>
  );
};
