// @flow

import React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { Profiling } from "screens/session_container/facets/profiling";
import { withRouter } from "utils/react_router_dom_wrapper";
import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import { createToastr } from "app/utils";
import SearchMovesPage from "screens/containers/search_moves_page";
import { AccountMenu } from "app/presentation/accountmenu";
import Ctr from "screens/containers/index";

// AppFrame
type AppFramePropsT = {
  children: any,
  defaultProps: any,
};

type DefaultPropsT = {
  profiling: Profiling,
};

function AppFrame(p: AppFramePropsT) {
  const props = mergeDefaultProps<AppFramePropsT & DefaultPropsT>(p);

  const cookieNotice = props.profiling.acceptsCookies ? (
    undefined
  ) : (
    <div className="cookieNotice flexrow justify-around items-center">
      <div>
        This site uses cookies to store the settings for the logged in user. By
        continuing to use this site you agree with that.
        <button
          className="button button--wide ml-2"
          onClick={props.profiling.acceptCookies}
        >
          Okay
        </button>
      </div>
    </div>
  );

  return (
    <div className="appFrame px-4 flexcol">
      {cookieNotice}
      {createToastr()}
      <div className="appFrame__banner flexrow items-center justify-between h-16 mt-4 mb-4">
        <div className="flexrow w-full">
          <h1 className="appFrame__home" onClick={() => alert("TODO")}>
            Lindy Science
          </h1>
          <SearchMovesPage />
        </div>
        <AccountMenu defaultProps={props.defaultProps} />
      </div>
      {props.children}
    </div>
  );
}

// $FlowFixMe
AppFrame = compose(
  withRouter,
  withDefaultProps,
  observer,
  Ctr.connect(state => ({}))
)(AppFrame);

export default AppFrame;
