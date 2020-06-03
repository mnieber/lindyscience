// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { mergeDefaultProps } from 'src/mergeDefaultProps';
import { MovesStore } from 'src/moves/MovesStore';
import Widgets from 'src/screens/presentation/index';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  movesStore: MovesStore,
};

export const SearchResultsPage: (PropsT) => any = observer((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  return (
    <div className="flexcol">
      <h1>Search results</h1>
      <Widgets.MoveTable moveSearchResults={props.movesStore.searchResults} />
    </div>
  );
});
