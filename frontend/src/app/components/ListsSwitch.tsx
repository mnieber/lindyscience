import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LoadMoveListEffect } from 'src/movelists/components/NavigateToMoveListEffect';
import { SelectMoveListEffect } from 'src/movelists/components/SelectMoveListEffect';
import { SelectMoveEffect } from 'src/movelists/components/SelectMoveEffect';
import { LoadMoveEffect } from 'src/moves/components/NavigateToMoveEffect';
import { MoveListFrame } from 'src/movelists/components/MoveListFrame';
import { CutVideoCtrProvider } from 'src/video/components/CutVideoCtrProvider';
import { MoveListDetailsPage } from 'src/movelists/components/MoveListDetailsPage';
import { MovePage } from 'src/moves/components/MovePage';
import { MoveCtrProvider } from 'src/moves/components/MoveCtrProvider';
import { TipsCtrProvider } from 'src/tips/components/TipsCtrProvider';

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
