// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { createErrorHandler } from 'src/app/utils';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { Profiling } from 'src/screens/session_container/facets/profiling';
import { SignInDialog } from 'src/app/presentation/signin_dialog';

// SignInPage

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  profiling: Profiling,
};

export const SignInPage: (PropsT) => any = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  return (
    <div className="signInPage flexrow">
      <SignInDialog
        signIn={(email, password) =>
          props.profiling
            .signIn(email, password)
            .catch(createErrorHandler('Could not sign in'))
        }
      />
    </div>
  );
});
