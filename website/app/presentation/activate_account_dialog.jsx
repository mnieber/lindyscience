// @flow

import React from "react";
import { Link } from "@reach/router";
import classnames from "classnames";

type ActivateAccountDialogPropsT = {
  activateAccount: (uid: string, token: string) => any,
  uid: string,
  token: string,
};

export function ActivateAccountDialog(props: ActivateAccountDialogPropsT) {
  const [isModal, setIsModal] = React.useState(true);
  const [globalErrorMsg, setGlobalErrorMsg] = React.useState("");

  // $FlowFixMe
  React.useEffect(async () => {
    if (props.uid && props.token) {
      const errorState = props.activateAccount(props.uid, props.token);
      if (errorState) {
        setGlobalErrorMsg(
          <div>
            There was a problem with activating your account. Please try to{" "}
            <Link to="/app/register/">register</Link> again.
          </div>
        );
      }
    }
  }, [props.uid, props.token]);

  return (
    <React.Fragment>
      <div
        id="activateAccountDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        {globalErrorMsg}
      </div>
    </React.Fragment>
  );
}
