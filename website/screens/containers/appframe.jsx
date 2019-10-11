// @flow

import React from "react";
import { navigate } from "@reach/router";
import Cookies from "js-cookie";

import { actAddMoveLists, actMarkMoveListNotFound } from "move_lists/actions";
import SearchMovesPage from "screens/containers/search_moves_page";
import { actAddMoves, actSetMovePrivateDatas } from "moves/actions";
import { actSetVotes } from "votes/actions";
import { actSetUserProfile } from "profiles/actions";
import { actSetLoadedMoveListUrls, actSetSignedInEmail } from "app/actions";
import { actAddTips } from "tips/actions";
import { createErrorHandler, createToastr } from "app/utils";
import { AccountMenu } from "app/presentation/accountmenu";
import Widgets from "screens/presentation/index";
import Ctr from "screens/containers/index";
import { getObjectValues } from "utils/utils";
import { findMoveListByUrl, newMoveListSlug } from "screens/utils";

import { apiGetEmail, apiSignOut } from "app/api";
import { apiLoadUserProfile } from "profiles/api";
import { apiFindMoveLists, apiLoadMoveList } from "screens/api";
import { apiLoadMovePrivateDatas } from "moves/api";
import { apiLoadUserTags } from "tags/api";
import { apiLoadUserVotes } from "votes/api";

import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";

// AppFrame
type AppFramePropsT = {
  selectedMoveListUrl: string,
  userProfile: ?UserProfileT,
  signedInEmail: string,
  loadedMoveListUrls: Array<string>,
  children: any,
  dispatch: Function,
};

function AppFrame(props: AppFramePropsT) {
  const [acceptsCookies, setAcceptsCookies] = React.useState(false);

  const [loadedEmail, setLoadedEmail] = React.useState("");
  const [loadingMoveListUrls, setLoadingMoveListUrls] = React.useState([]);

  async function _loadEmail() {
    const [email] = await Promise.all([apiGetEmail()]);
    props.dispatch(actSetSignedInEmail(email ? email : "anonymous"));
  }

  async function _loadUserProfile() {
    if (!!props.signedInEmail && loadedEmail != props.signedInEmail) {
      if (props.signedInEmail === "anonymous") {
        props.dispatch(actSetUserProfile(undefined));
        props.dispatch(actSetVotes({}));
        props.dispatch(actSetMovePrivateDatas({}));
      } else {
        const [profile, votes, tags, movePrivateDatas] = await Promise.all([
          apiLoadUserProfile(),
          apiLoadUserVotes(),
          apiLoadUserTags(),
          apiLoadMovePrivateDatas(),
        ]);
        props.dispatch(actSetUserProfile(profile));
        props.dispatch(actSetVotes(votes));
        props.dispatch(
          actSetMovePrivateDatas(
            movePrivateDatas.entities.movePrivateDatas || {}
          )
        );

        const [moveLists] = await Promise.all([
          apiFindMoveLists(profile.username),
        ]);
        props.dispatch(actAddMoveLists(moveLists.entities.moveLists || {}));
      }

      setLoadedEmail(props.signedInEmail);
    }
  }

  async function _loadSelectedMoveList() {
    if (
      !!props.selectedMoveListUrl &&
      !props.loadedMoveListUrls.includes(props.selectedMoveListUrl) &&
      !loadingMoveListUrls.includes(props.selectedMoveListUrl)
    ) {
      setLoadingMoveListUrls([
        ...loadingMoveListUrls,
        props.selectedMoveListUrl,
      ]);

      const [ownerUsername, slug] = props.selectedMoveListUrl.split("/");

      if (slug != newMoveListSlug) {
        var moveList;
        try {
          [moveList] = await Promise.all([
            apiLoadMoveList(ownerUsername, slug),
          ]);
        } catch {
          props.dispatch(actMarkMoveListNotFound(props.selectedMoveListUrl));
          return;
        }
        props.dispatch(
          actAddMoves(getObjectValues(moveList.entities.moves || {}))
        );
        props.dispatch(actAddMoveLists(moveList.entities.moveLists));
        props.dispatch(actAddTips(moveList.entities.tips || {}));
        props.dispatch(
          actSetLoadedMoveListUrls([
            ...props.loadedMoveListUrls,
            props.selectedMoveListUrl,
          ])
        );
      }
    }
  }

  React.useEffect(() => {
    _loadEmail();
  }, []);
  React.useEffect(() => {
    _loadUserProfile();
  }, [props.signedInEmail]);
  React.useEffect(() => {
    _loadSelectedMoveList();
  });

  const signOut = () => {
    apiSignOut().catch(createErrorHandler("Could not update the move list"));
    props.dispatch(actSetSignedInEmail(""));
    navigate("/app/sign-in/");
  };

  const _acceptCookies = () => {
    Cookies.set("acceptCookies", 1);
    setAcceptsCookies(true);
  };

  const cookieNotice = Cookies.get("acceptCookies") ? (
    undefined
  ) : (
    <div className="cookieNotice flexrow justify-around items-center">
      <div>
        This site uses cookies to store the settings for the logged in user. By
        continuing to use this site you agree with that.
        <button className="button button--wide ml-2" onClick={_acceptCookies}>
          Okay
        </button>
      </div>
    </div>
  );

  return (
    <div className="appFrame px-4 flexcol">
      {cookieNotice}
      {createToastr()}
      <div className="appFrame__banner flexrow items-center justify-between h-16 mt-4 mb-8">
        <div className="flexrow w-full">
          <h1 className="appFrame__home" onClick={() => alert("TODO")}>
            Lindy Science
          </h1>
          <SearchMovesPage />
        </div>
        <AccountMenu
          className="self-start"
          userProfile={props.userProfile}
          signIn={() =>
            navigate("/app/sign-in/?next=" + window.location.pathname)
          }
          signOut={signOut}
        />
      </div>
      {props.children}
    </div>
  );
}

// $FlowFixMe
AppFrame = Ctr.connect(state => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
  signedInEmail: Ctr.fromStore.getSignedInEmail(state),
  selectedMoveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
  loadedMoveListUrls: Ctr.fromStore.getLoadedMoveListUrls(state),
}))(AppFrame);

export default AppFrame;
