import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';
import { keys } from 'lodash/fp';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { SearchMovesForm } from 'src/search/presentation/SearchMovesForm';
import { UserProfileT } from 'src/profiles/types';
import { MovesStore } from 'src/moves/MovesStore';
import { apiFindMoves } from 'src/search/api';
import { Navigation } from 'src/session/facets/Navigation';

// SearchMovesPage

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  userProfile: UserProfileT;
  movesStore: MovesStore;
  navigation: Navigation;
};

export const SearchMovesPage: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const [latestOptions, setLatestOptions] = React.useState([]);
  const history = props.navigation.history;

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
    history.push(`/search`);
  };

  return (
    <SearchMovesForm
      autoFocus={false}
      knownTags={keys(props.movesStore.tags)}
      latestOptions={latestOptions}
      onSubmit={_findMoves}
      defaultProps={props.defaultProps}
    />
  );
});
