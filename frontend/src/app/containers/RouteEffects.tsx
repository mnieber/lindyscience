import { compose } from 'rambda';
import React from 'react';

import { withDefaultProps, mergeDefaultProps } from 'src/npm/mergeDefaultProps';
import { Navigation } from 'src/session/facets/Navigation';
import { makeSlugid } from 'src/app/utils';

export const withMoveTarget = compose(
  withDefaultProps,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps(p);
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveSlugid: makeSlugid(params.moveSlug, params.moveId),
        moveListUrl: params.ownerUsername + '/' + params.moveListSlug,
      });
    });
    return <WrappedComponent {...p} />;
  }
);

export const withMoveListTarget = compose(
  withDefaultProps,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps(p);
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveListUrl: params.ownerUsername + '/' + params.moveListSlug,
      });
    });
    return <WrappedComponent {...p} />;
  }
);
