// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { MoveTable } from 'src/search/presentation/MoveTable';
import { MovesStore } from 'src/moves/MovesStore';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  movesStore: MovesStore,
};

export const SearchResultsPage: (PropsT) => any = compose(
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
