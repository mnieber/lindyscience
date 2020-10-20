import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { useDefaultProps, FC } from 'react-default-props-context';
import { MoveTable } from 'src/search/presentation/MoveTable';
import { MovesStore } from 'src/moves/MovesStore';

type PropsT = {};

type DefaultPropsT = {
  movesStore: MovesStore;
};

export const SearchResultsPage: FC<PropsT, DefaultPropsT> = compose(observer)(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);
    return (
      <div className="flexcol">
        <h1>Search results</h1>
        <MoveTable moveSearchResults={props.movesStore.searchResults} />
      </div>
    );
  }
);
