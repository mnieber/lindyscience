// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MovesStore } from 'src/moves/MovesStore';
import type { UserProfileT } from 'src/profiles/types';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { useHistory } from 'src/utils/react_router_dom_wrapper';
import Widgets from 'src/screens/presentation/index';
import { apiFindMoves } from 'src/screens/api';

// SearchMovesPage

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  userProfile: UserProfileT,
  movesStore: MovesStore,
};

export const SearchMovesPage: (PropsT) => any = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const [latestOptions, setLatestOptions] = React.useState([]);
  const history = useHistory();

  const _findMoves = async (values: any) => {
    const getUser = (x) => {
      const parts = x.split(':');
      if (parts.length == 2 && parts[0] == 'user') {
        return parts[1] == 'me'
          ? props.userProfile
            ? props.userProfile.username
            : undefined
          : parts[1];
      }
      return undefined;
    };

    const users = values.keywords.map(getUser);

    const moveSearchResults = await apiFindMoves(
      users.length ? users[users.length - 1] : '',
      values.keywords.filter((x) => getUser(x) == undefined),
      values.tags
    );
    props.movesStore.setSearchResults(moveSearchResults);
    setLatestOptions({ ...values });
    history.push(`/app/search`);
  };

  return (
    <Widgets.SearchMovesForm
      autoFocus={false}
      knownTags={Object.keys(props.movesStore.tags)}
      latestOptions={latestOptions}
      onSubmit={_findMoves}
      defaultProps={props.defaultProps}
    />
  );
});
