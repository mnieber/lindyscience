// @flow

import * as React from "react";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import type { TagT } from "tags/types";
import type { MoveSearchResultT } from "screens/types";

// SearchResultsPage

type SearchResultsPagePropsT = {
  moveSearchResults: Array<MoveSearchResultT>,
};

function SearchResultsPage(props: SearchResultsPagePropsT) {
  return (
    <div className="flexcol">
      <h1>Search results</h1>
      <Widgets.MoveTable moveSearchResults={props.moveSearchResults} />
    </div>
  );
}

// $FlowFixMe
SearchResultsPage = Ctr.connect(state => ({
  moveSearchResults: Ctr.fromStore.getMoveSearchResults(state),
}))(SearchResultsPage);

export default SearchResultsPage;
