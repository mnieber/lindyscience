// @flow

import * as React from "react";
import MovesCtr from "moves/containers/index";

import Widgets from "moves/presentation/index";

import type { TagT, UserProfileT } from "profiles/types";

// SearchMovesDialog

type SearchMovesDialogPropsT = {
  userProfile: ?UserProfileT,
  moveTags: Array<TagT>,
};

export function SearchMovesDialog(props: SearchMovesDialogPropsT) {
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
    <div className="SearchMovesDialog flexcol">
      <h1>Search moves</h1>
      <Widgets.SearchMovesForm
        autoFocus={false}
        knownTags={props.moveTags}
        onSubmit={_findMoves}
        latestOptions={latestOptions}
      />
      <div className="mt-2" />
      <Widgets.MoveTable moves={searchResults} />
    </div>
  );
}
