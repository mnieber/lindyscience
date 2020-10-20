import { compose } from 'lodash/fp';
import React from 'react';

import { Navigation } from 'src/session/facets/Navigation';
import { makeSlugid } from 'src/app/utils';

export const withMoveTarget = compose(
  (WrappedComponent: any) => (props: any) => {
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveSlugid: makeSlugid(params.moveSlug, params.moveId),
        moveListUrl: params.ownerUsername + '/' + params.moveListSlug,
      });
    });
    return <WrappedComponent {...props} />;
  }
);

export const withMoveListTarget = compose(
  (WrappedComponent: any) => (props: any) => {
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveListUrl: params.ownerUsername + '/' + params.moveListSlug,
      });
    });
    return <WrappedComponent {...props} />;
  }
);
