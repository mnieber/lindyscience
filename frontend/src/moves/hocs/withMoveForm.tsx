import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveT } from 'src/moves/types';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { action } from 'src/utils/mobx_wrapper';
import { MoveForm } from 'src/moves/presentation/MoveForm';
import { Editing } from 'facet-mobx/facets/editing';
import { mergeDefaultProps } from 'react-default-props-context';

type PropsT = {};

type DefaultPropsT = {
  movesEditing: Editing;
  move: MoveT;
  moveCtr: MoveContainer;
  videoController: VideoController;
};

export const withMoveForm = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props = mergeDefaultProps<PropsT, DefaultPropsT>(p);

    const _setAltLink = action((altLink: string | undefined) => {
      props.videoController.setPlayer(undefined);
      props.moveCtr.inputs.altLink = altLink;
    });

    const moveForm = (
      <MoveForm
        autoFocus={true}
        move={props.move}
        onSubmit={(values) => {
          _setAltLink(undefined);
          props.movesEditing.save(values);
        }}
        onCancel={() => {
          _setAltLink(undefined);
          props.movesEditing.cancel();
        }}
        knownTags={props.move?.tags ?? []}
        videoController={props.videoController}
        setAltLink={_setAltLink}
      />
    );

    return <WrappedComponent moveForm={moveForm} {...p} />;
  });
