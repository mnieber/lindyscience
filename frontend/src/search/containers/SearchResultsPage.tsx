import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';
import { MoveTable } from 'src/search/presentation/MoveTable';
import { MovesStore } from 'src/moves/MovesStore';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  movesStore: MovesStore;
};

export const SearchResultsPage: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  return (
    <div className="flexcol">
      <h1>Search results</h1>
      <MoveTable moveSearchResults={props.movesStore.searchResults} />
    </div>
  );
});
