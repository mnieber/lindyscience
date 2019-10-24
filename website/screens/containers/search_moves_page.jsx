// @flow

import * as React from "react";
import { navigate } from "@reach/router";

import { actSetMoveSearchResults } from "screens/actions";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import { apiFindMoves } from "screens/api";

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
    const getUser = x => {
      const parts = x.split(":");
      if (parts.length == 2 && parts[0] == "user") {
        return parts[1] == "me"
          ? props.userProfile
            ? props.userProfile.username
            : undefined
          : parts[1];
      }
      return undefined;
    };

    const users = values.keywords.map(getUser);

    const moveSearchResults = await apiFindMoves(
      users.length ? users[users.length - 1] : "",
      values.keywords.filter(x => getUser(x) == undefined),
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
