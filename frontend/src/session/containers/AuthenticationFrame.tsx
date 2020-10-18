import React from 'react';
import { observer } from 'mobx-react';
import { compose } from 'lodash/fp';

// PasswordResetPage

type PropsT = {
  header: string;
  children: any;
};

export const AuthenticationFrame = compose(observer)((props: PropsT) => {
  return (
    <div className="">
      <h1 className="text-lg">{props.header}</h1>
      {props.children}
    </div>
  );
});
