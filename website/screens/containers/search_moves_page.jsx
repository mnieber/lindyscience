// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";

import type { UserProfileT } from "profiles/types";
import { mergeDefaultProps, withDefaultProps } from "facet/default_props";
import { useHistory } from "utils/react_router_dom_wrapper";
import { actSetMoveSearchResults } from "screens/actions";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import { apiFindMoves } from "screens/api";
import type { TagT } from "tags/types";

// SearchMovesPage

type SearchMovesPagePropsT = {
  moveTags: Array<TagT>,
  dispatch: Function,
  defaultProps: any,
} & {
  // default props
  userProfile: UserProfileT,
};

const _SearchMovesPage = (p: SearchMovesPagePropsT) => {
  const props = mergeDefaultProps(p);

  const [latestOptions, setLatestOptions] = React.useState([]);
  const history = useHistory();

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
    history.push(`/app/search`);
  };

  return (
    <Widgets.SearchMovesForm
      autoFocus={false}
      knownTags={props.moveTags}
      latestOptions={latestOptions}
      onSubmit={_findMoves}
      defaultProps={props.defaultProps}
    />
  );
};

// $FlowFixMe
const SearchMovesPage = compose(
  Ctr.connect(state => ({
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  withDefaultProps,
  observer
)(_SearchMovesPage);

export default SearchMovesPage;
