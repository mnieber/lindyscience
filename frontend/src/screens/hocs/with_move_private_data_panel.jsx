// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MovesStore } from 'src/moves/MovesStore';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import type { MoveT } from 'src/moves/types';
import type { UserProfileT } from 'src/profiles/types';
import Widgets from 'src/screens/presentation/index';
import { getId, createErrorHandler } from 'src/app/utils';
import { apiSaveMovePrivateData } from 'src/moves/api';

type PropsT = {
  videoController?: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  movesStore: MovesStore,
};

export const withMovePrivateDataPanel = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
    const movePrivateData = props.move
      ? props.movesStore.getOrCreatePrivateData(props.move.id)
      : undefined;

    const _onSave = (values) => {
      if (!movePrivateData) return;

      const mpd = {
        ...movePrivateData,
        ...values,
      };

      props.movesStore.addMovePrivateDatas({
        [movePrivateData.moveId]: mpd,
      });
      apiSaveMovePrivateData(mpd).catch(
        createErrorHandler(
          'We could not update your private data for this move'
        )
      );
    };

    const movePrivateDataPanel = (
      <Widgets.MovePrivateDataPanel
        userProfile={props.userProfile}
        movePrivateData={movePrivateData}
        onSave={_onSave}
        moveTags={Object.keys(props.movesStore.tags)}
        moveId={getId(props.move)}
        videoController={props.videoController}
      />
    );

    return (
      // $FlowFixMe
      <WrappedComponent movePrivateDataPanel={movePrivateDataPanel} {...p} />
    );
  }
);
