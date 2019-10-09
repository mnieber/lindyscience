// @flow

import * as React from "react";
import { navigate } from "@reach/router";

import { actSetMoveSearchResults } from "screens/actions";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";

// SearchMovesPage

type SearchMovesPagePropsT = {
  userProfile: ?UserProfileT,
  moveTags: Array<TagT>,
  moveListUrl: string,
  dispatch: Function,
};

function SearchMovesPage(props: SearchMovesPagePropsT) {
  const [latestOptions, setLatestOptions] = React.useState([]);

  const _findMoves = async (values: any) => {
    const moveSearchResults = await Ctr.api.findMoves(
      values.myMoveLists && props.userProfile ? props.userProfile.username : "",
      values.keywords,
      values.tags
    );
    props.dispatch(actSetMoveSearchResults(moveSearchResults));
    setLatestOptions({ ...values });
    navigate(`/app/lists/${props.moveListUrl}/search`);
  };

  return (
    <Widgets.SearchMovesForm
      autoFocus={false}
      knownTags={props.moveTags}
      latestOptions={latestOptions}
      onSubmit={_findMoves}
    />
  );
}

// $FlowFixMe
SearchMovesPage = Ctr.connect(state => ({
  moveTags: Ctr.fromStore.getMoveTags(state),
  userProfile: Ctr.fromStore.getUserProfile(state),
  moveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
}))(SearchMovesPage);

export default SearchMovesPage;
