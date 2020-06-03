// @flow

import * as React from "react";
import { observer } from "mobx-react";

import { MoveContainer } from "screens/move_container/move_container";
import type { TagT } from "tags/types";
import { VideoController } from "screens/move_container/facets/video_controller";
import { Editing } from "facet-mobx/facets/editing";
import type { MoveT } from "moves/types";
import { mergeDefaultProps } from "mergeDefaultProps";
import { action } from "utils/mobx_wrapper";
import { MoveForm } from "moves/presentation/move_form";

type PropsT = {
  moveTags: Array<TagT>,
  defaultProps: any,
};

type DefaultPropsT = {
  movesEditing: Editing,
  move: MoveT,
  moveCtr: MoveContainer,
  videoCtr: VideoController,
};

export const withMoveForm = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

    const _setAltLink = action(altLink => {
      props.videoCtr.setPlayer(undefined);
      props.moveCtr.inputs.altLink = altLink;
    });

    const moveForm = (
      <MoveForm
        autoFocus={true}
        move={props.move}
        onSubmit={values => {
          _setAltLink(undefined);
          props.movesEditing.save(values);
        }}
        onCancel={() => {
          _setAltLink(undefined);
          props.movesEditing.cancel();
        }}
        knownTags={props.moveTags}
        videoCtr={props.videoCtr}
        setAltLink={_setAltLink}
      />
    );

    return <WrappedComponent moveForm={moveForm} {...p} />;
  });
