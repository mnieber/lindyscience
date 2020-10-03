import { compose } from 'lodash/fp';
import React from 'react';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { UserProfileT } from 'src/profiles/types';
import { Navigation } from 'src/session/facets/Navigation';
import { helpUrl } from 'src/moves/utils';
import { browseToMoveUrl } from 'src/app/containers';

type PropsT = {};

type DefaultPropsT = {
  userProfile: UserProfileT;
  navigation: Navigation;
};

export const IndexPage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  function _loadRecentMove() {
    const url =
      props.userProfile && props.userProfile.recentMoveUrl
        ? props.userProfile.recentMoveUrl
        : helpUrl.substr('/lists/'.length);
    if (props.navigation?.history) {
      browseToMoveUrl(props.navigation.history.push, [url], false);
    }
  }
  React.useEffect(() => {
    _loadRecentMove();
  }, [props.userProfile, props.navigation]);

  return <div className="h-full" />;
});
