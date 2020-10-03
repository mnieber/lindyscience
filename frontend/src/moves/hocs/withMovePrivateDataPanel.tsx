import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';
import { keys } from 'lodash/fp';

import { MovePrivateDataPanel } from 'src/moves/presentation/MovePrivateDataPanel';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { MoveT } from 'src/moves/types';
import { UserProfileT } from 'src/profiles/types';
import { MovesStore } from 'src/moves/MovesStore';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiSaveMovePrivateData } from 'src/moves/api';

type PropsT = {
  videoController?: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  move: MoveT;
  userProfile: UserProfileT;
  movesStore: MovesStore;
};

export const withMovePrivateDataPanel = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
    const movePrivateData = props.move
      ? props.movesStore.getOrCreatePrivateData(props.move.id)
      : undefined;

    const _onSave = (values: any) => {
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
      <MovePrivateDataPanel
        userProfile={props.userProfile}
        movePrivateData={movePrivateData}
        onSave={_onSave}
        moveTags={keys(props.movesStore.tags)}
        moveId={getId(props.move)}
        videoController={props.videoController}
      />
    );

    return (
      <WrappedComponent movePrivateDataPanel={movePrivateDataPanel} {...p} />
    );
  }
);
