// @flow

import React from 'react'
import classnames from 'classnames';
import { useState } from 'react';


export function AccountMenu({
  className,
  loggedInUserName,
  signIn
}: {
  className: string,
  loggedInUserName: string,
  signIn: Function,
}) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  const node = loggedInUserName
    ? <React.Fragment>
        <button onClick={toggle}>{`Hello ${loggedInUserName} ⛛`}</button>
        {
          expanded &&
          <ul className="list-reset bg-green">
            <li><a href="#" className="px-4 py-2 block text-black hover:bg-grey-light">My account</a></li>
            <li><a href="#" className="px-4 py-2 block text-black hover:bg-grey-light">Notifications</a></li>
            <li><hr className="border-t mx-2 border-grey-ligght"/></li>
            <li><a href="#" className="px-4 py-2 block text-black hover:bg-grey-light">Logout</a></li>
          </ul>
        }
      </React.Fragment>
    : <button onClick={signIn}>{`Sign in`}</button>

  return (
    <div className={classnames(className, "w-32")}>
      <div className={classnames("absolute", "z-10")}>
        {node}
      </div>
    </div>
  );
}
