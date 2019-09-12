// @flow

import * as React from "react";
import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";
import { isOwner } from "app/utils";
import { getObjectValues } from "utils/utils";

import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";

type CutVideoPagePropsT = {
  moveList: MoveListT,
  // receive any actions as well
};

export function CutVideoPage(props: CutVideoPagePropsT) {
  const cutVideoPanel = <Widgets.CutVideoPanel />;

  return <div>{cutVideoPanel}</div>;
}

// $FlowFixMe
CutVideoPage = Ctr.connect(
  state => ({
    moveList: Ctr.fromStore.getSelectedMoveList(state),
  }),
  Ctr.actions
)(CutVideoPage);

export default CutVideoPage;
