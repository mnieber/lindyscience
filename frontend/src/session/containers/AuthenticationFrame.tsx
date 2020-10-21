import React from 'react';
import { observer } from 'mobx-react';

// PasswordResetPage

type PropsT = React.PropsWithChildren<{
  header: string;
}>;

export const AuthenticationFrame = observer((props: PropsT) => {
  return (
    <div className="">
      <h1 className="text-lg">{props.header}</h1>
      {props.children}
    </div>
  );
});
