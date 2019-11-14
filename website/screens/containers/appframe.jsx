// @flow

import React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";
import classnames from "classnames";
import { debounce } from "debounce";
import ReactResizeDetector from "react-resize-detector";

import { Display } from "screens/session_container/facets/display";
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
  display: Display,
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

  const onResize = x => {
    props.display.showSmall(window.innerWidth < props.display.smallBreakPoint);
  };

  return (
    <div
      className={classnames("appFrame flexcol", {
        "px-1": props.display.small,
        "px-4": !props.display.small,
      })}
    >
      <ReactResizeDetector handleWidth onResize={debounce(onResize, 10)} />
      {cookieNotice}
      {createToastr()}
      <div className="appFrame__banner flexrow items-center justify-between h-16 mt-4 mb-4">
        <div className="flexrow w-full">
          <div className="flexcol">
            <h1 className="appFrame__home" onClick={() => alert("TODO")}>
              Lindy
            </h1>
            <h2>Science</h2>
          </div>
          <SearchMovesPage />
        </div>
        {!props.display.small && (
          <AccountMenu defaultProps={props.defaultProps} />
        )}
      </div>
      {props.children}
    </div>
  );
}

// $FlowFixMe
AppFrame = compose(
  withRouter,
  withDefaultProps,
  Ctr.connect(state => ({})),
  observer
)(AppFrame);

export default AppFrame;
