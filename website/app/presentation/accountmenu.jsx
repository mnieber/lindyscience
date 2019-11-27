// @flow

import React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";

import { helpUrl } from "moves/utils";
import { mergeDefaultProps } from "facet/default_props";
import { createErrorHandler } from "app/utils";
import { Profiling } from "screens/session_container/facets/profiling";
import { Navigation } from "screens/session_container/facets/navigation";
import type { UserProfileT } from "profiles/types";

type AccountMenuPropsT = {};

type DefaultPropsT = {
  userProfile: ?UserProfileT,
  navigation: Navigation,
  profiling: Profiling,
};

export const AccountMenu = observer((p: AccountMenuPropsT) => {
  const props = mergeDefaultProps<AccountMenuPropsT & DefaultPropsT>(p);

  const [expanded, setExpanded] = React.useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  const node = (
    <React.Fragment>
      <button onClick={toggle}>{`Hello ${
        props.userProfile ? props.userProfile.username : "stranger!"
      } ⛛`}</button>
      {expanded && (
        <ul className="list-reset bg-white">
          <li className={classnames({ hidden: !props.userProfile })}>
            <a
              href="#"
              className="px-4 py-2 block text-black hover:bg-grey-light"
            >
              My account
            </a>
          </li>
          <li className={classnames({ hidden: !props.userProfile })}>
            <a
              href="#"
              className="px-4 py-2 block text-black hover:bg-grey-light"
            >
              Notifications
            </a>
          </li>
          <li>
            <hr className="border-t mx-2 border-grey-ligght" />
          </li>
          <li>
            <a
              href="#"
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                props.navigation.history.push(helpUrl);
              }}
            >
              Help
            </a>
          </li>
          <li className={classnames({ hidden: !props.userProfile })}>
            <a
              href="#"
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                props.profiling
                  .signOut()
                  .catch(createErrorHandler("Could not sign out"));
              }}
            >
              Sign out
            </a>
          </li>
          <li className={classnames({ hidden: !!props.userProfile })}>
            <a
              href="#"
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                const postfix = window.location.pathname.includes("/sign-in")
                  ? ""
                  : `?next=${window.location.pathname}`;
                props.navigation.history.push("/app/sign-in/" + postfix);
              }}
            >
              Sign in
            </a>
          </li>
        </ul>
      )}
    </React.Fragment>
  );

  return (
    <div className={classnames("self-start", "w-32")}>
      <div className={classnames("absolute", "z-10")}>{node}</div>
    </div>
  );
});
