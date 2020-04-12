// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { mergeDefaultProps, withDefaultProps } from "facet/default_props";
import type { MoveT } from "moves/types";
import type { UserProfileT } from "profiles/types";
import { createUUID } from "utils/utils";
import Ctr from "screens/containers/index";
import { actAddMovePrivateDatas } from "moves/actions";
import Widgets from "screens/presentation/index";
import { getId, createErrorHandler } from "app/utils";
import { apiSaveMovePrivateData } from "moves/api";
import type { TagT } from "tags/types";

type PropsT = {
  moveTags: Array<TagT>,
  dispatch: Function,
  videoCtr?: any,
  defaultProps: any,
} & {
  // default props
  move: MoveT,
  userProfile: UserProfileT,
};

// $FlowFixMe
export const withMovePrivateDataPanel = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props = mergeDefaultProps(p);

    const _onSave = values => {
      const movePrivateData = {
        id: createUUID(),
        moveId: getId(props.move),
        ...props.move.privateData,
        ...values,
      };

      props.dispatch(
        actAddMovePrivateDatas({ [movePrivateData.id]: movePrivateData })
      );
      apiSaveMovePrivateData(movePrivateData).catch(
        createErrorHandler(
          "We could not update your private data for this move"
        )
      );
    };

    const movePrivateDataPanel = (
      <Widgets.MovePrivateDataPanel
        userProfile={props.userProfile}
        movePrivateData={props.move ? props.move.privateData : undefined}
        onSave={_onSave}
        moveTags={props.moveTags}
        moveId={getId(props.move)}
        videoCtr={props.videoCtr}
      />
    );

    return (
      <WrappedComponent movePrivateDataPanel={movePrivateDataPanel} {...p} />
    );
  }
);
