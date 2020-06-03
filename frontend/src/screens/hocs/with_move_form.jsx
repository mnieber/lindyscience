// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveContainer } from 'src/screens/move_container/move_container';
import type { TagT } from 'src/tags/types';
import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { Editing } from 'src/facet-mobx/facets/editing';
import type { MoveT } from 'src/moves/types';
import { mergeDefaultProps } from 'src/mergeDefaultProps';
import { action } from 'src/utils/mobx_wrapper';
import { MoveForm } from 'src/moves/presentation/move_form';

type PropsT = {
  moveTags: Array<TagT>,
  defaultProps?: any,
};

type DefaultPropsT = {
  movesEditing: Editing,
  move: MoveT,
  moveCtr: MoveContainer,
  videoController: VideoController,
};

export const withMoveForm = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const _setAltLink = action((altLink) => {
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
        knownTags={props.moveTags}
        videoController={props.videoController}
        setAltLink={_setAltLink}
      />
    );

    // $FlowFixMe
    return <WrappedComponent moveForm={moveForm} {...p} />;
  });
