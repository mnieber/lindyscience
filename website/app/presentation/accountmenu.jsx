// @flow

import React from "react";
import classnames from "classnames";
import type { UserProfileT } from "app/types";

type AccountMenuPropsT = {
  className: string,
  userProfile: ?UserProfileT,
  signIn: () => void,
  signOut: () => void,
};

export function AccountMenu(props: AccountMenuPropsT) {
  const [expanded, setExpanded] = React.useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  const node = props.userProfile ? (
    <React.Fragment>
      <button onClick={toggle}>{`Hello ${
        props.userProfile.username
      } ⛛`}</button>
      {expanded && (
        <ul className="list-reset bg-green">
          <li>
            <a
              href="#"
              className="px-4 py-2 block text-black hover:bg-grey-light"
            >
              My account
            </a>
          </li>
          <li>
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
              onClick={props.signOut}
            >
              Sign out
            </a>
          </li>
        </ul>
      )}
    </React.Fragment>
  ) : (
    <button onClick={props.signIn}>{`Sign in`}</button>
  );

  return (
    <div className={classnames(props.className, "w-32")}>
      <div className={classnames("absolute", "z-10")}>{node}</div>
    </div>
  );
}
