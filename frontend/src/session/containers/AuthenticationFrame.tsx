// @flow

import React from 'react';

// PasswordResetPage

type PropsT = {
  header: string,
  children: any,
};

export const AuthenticationFrame = (props: PropsT) => {
  return (
    <div className="">
      <h1 className="text-lg">{props.header}</h1>
      {props.children}
    </div>
  );
};
