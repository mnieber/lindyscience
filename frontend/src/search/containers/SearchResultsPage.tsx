import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveTable } from 'src/search/presentation/MoveTable';
import { useStore } from 'src/app/components/StoreProvider';

export const SearchResultsPage: React.FC = observer(() => {
  const { movesStore } = useStore();
  return (
    <div className="flexcol">
      <h1>Search results</h1>
      <MoveTable moveSearchResults={movesStore.searchResults} />
    </div>
  );
});
