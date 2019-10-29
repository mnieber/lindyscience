// @flow

import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

type ActivateAccountDialogPropsT = {
  activateAccount: (uid: string, token: string) => any,
  uid: string,
  token: string,
};

export function ActivateAccountDialog(props: ActivateAccountDialogPropsT) {
  const [globalErrorMsg, setGlobalErrorMsg] = React.useState("");

  async function activateAccount() {
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
  }

  React.useEffect(() => {
    // Don't inline, we need to swallow the return value of async
    activateAccount();
  }, [props.uid, props.token]);

  return (
    <React.Fragment>
      <div id="activateAccountDialog" className={classnames("bullsEyeWindow")}>
        {globalErrorMsg}
      </div>
    </React.Fragment>
  );
}
