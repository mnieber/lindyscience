// @flow

import * as React from "react";
import AppCtr from "app/containers/index";
import MovesCtr from "moves/containers/index";
import Widgets from "moves/presentation/index";

import type { TagT, UserProfileT } from "profiles/types";

// SearchMovesPage

type SearchMovesPagePropsT = {
  userProfile: ?UserProfileT,
  moveTags: Array<TagT>,
};

function SearchMovesPage(props: SearchMovesPagePropsT) {
  const [searchResults, setSearchResults] = React.useState([]);
  const [latestOptions, setLatestOptions] = React.useState([]);

  const _findMoves = async (values: any) => {
    const searchResults = await MovesCtr.api.findMoves(
      values.myMoveLists && props.userProfile ? props.userProfile.username : "",
      values.keywords,
      values.tags
    );
    setSearchResults(searchResults);
    setLatestOptions({ ...values });
  };

  return (
    <div className="SearchMovesPage flexrow">
      <Widgets.SearchMovesDialog
        moveTags={props.moveTags}
        userProfile={props.userProfile}
        latestOptions={latestOptions}
        searchResults={searchResults}
        findMoves={_findMoves}
      />
    </div>
  );
}

// $FlowFixMe
SearchMovesPage = MovesCtr.connect(
  state => ({
    moveTags: MovesCtr.fromStore.getMoveTags(state),
    userProfile: AppCtr.fromStore.getUserProfile(state),
  }),
  MovesCtr.actions
)(SearchMovesPage);

export default SearchMovesPage;
