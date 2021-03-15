import * as React from 'react';
import { observer } from 'mobx-react';

import { SearchMovesForm } from 'src/search/components/SearchMovesForm';
import { apiFindMoves } from 'src/search/api';
import { useStore } from 'src/app/components/StoreProvider';

// SearchMovesPage

export const SearchMovesPage: React.FC = observer(() => {
  const { tagsStore, navigationStore, profilingStore, movesStore } = useStore();

  const [latestOptions, setLatestOptions] = React.useState([]);
  const history = navigationStore.history;

  const _findMoves = async (values: any) => {
    const getUser = (x: string) => {
      const parts = x.split(':');
      if (parts.length === 2 && parts[0] === 'user') {
        return parts[1] === 'me'
          ? profilingStore.userProfile
            ? profilingStore.userProfile.username
            : undefined
          : parts[1];
      }
      return undefined;
    };

    const users = values.keywords.map(getUser);

    const moveSearchResults = await apiFindMoves(
      users.length ? users[users.length - 1] : '',
      values.keywords.filter((x: string) => getUser(x) === undefined),
      values.tags
    );
    movesStore.setSearchResults(moveSearchResults);
    setLatestOptions({ ...values });
    history.push(`/search`);
  };

  return (
    <SearchMovesForm
      autoFocus={false}
      knownTags={tagsStore.moveTags}
      latestOptions={latestOptions}
      onSubmit={_findMoves}
    />
  );
});
