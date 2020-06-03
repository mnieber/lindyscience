import { compose } from 'rambda';
import React from 'react';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import type { UserProfileT } from 'src/profiles/types';
import { useHistory } from 'src/utils/react_router_dom_wrapper';
import { helpUrl } from 'src/moves/utils';
import { browseToMoveUrl } from 'src/screens/containers';

type PropsT = {};

type DefaultPropsT = {
  userProfile: UserProfileT,
  navigation: Navigation,
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
        : helpUrl.substr('/app/lists/'.length);
    if (props.navigation?.history) {
      browseToMoveUrl(props.navigation.history.push, [url], false);
    }
  }
  React.useEffect(() => {
    _loadRecentMove();
  }, [props.userProfile, props.navigation]);

  return <div className="h-full" />;
});
