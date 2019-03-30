// @flow

import * as React from "react";
import AppCtr from "app/containers/index";

// MoveSearchPage

type MoveSearchPagePropsT = {};

function MoveSearchPage(props: MoveSearchPagePropsT) {
  return <div className="moveSearchPage flexrow" />;
}

// $FlowFixMe
MoveSearchPage = AppCtr.connect(state => ({}), AppCtr.actions)(MoveSearchPage);

export default MoveSearchPage;
