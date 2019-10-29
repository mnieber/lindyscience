// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import {
  Navigation,
  getStatus,
} from "screens/session_container/facets/navigation";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import Ctr from "screens/containers/index";
import { withMoveDiv } from "screens/hocs/with_move";
import { withMoveVideoBvr } from "screens/hocs/with_move_video_bvr";

type MovePagePropsT = {
  movePrivateDataPanel: any,
  moveDiv: any,
  dispatch: Function,
  defaultProps: any,
} & {
  // default props
  navigation: Navigation,
  moveList: MoveListT,
  move: MoveT,
};

const _MovePage = (p: MovePagePropsT) => {
  const props = mergeDefaultProps(p);

  if (!props.moveList) {
    const status = getStatus(props.navigation);
    const notFoundDiv = <div>Oops, I cannot find this move list</div>;
    const loadingDiv = <div>Loading move list, please wait...</div>;
    return status.moveListUrl.notFound ? notFoundDiv : loadingDiv;
  }

  if (!props.move) {
    return <div>Oops, I cannot find this move</div>;
  }

  return props.moveDiv;
};

// $FlowFixMe
export const MovePage = compose(
  withMoveVideoBvr,
  withMoveDiv,
  Ctr.connect(state => ({})),
  withDefaultProps,
  observer
)(_MovePage);

export default MovePage;
