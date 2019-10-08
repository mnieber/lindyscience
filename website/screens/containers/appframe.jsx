// @flow

import React from "react";

import { actAddMoves, actSetMovePrivateDatas } from "moves/actions";
import { actSetVotes } from "votes/actions";
import { actSetUserProfile } from "profiles/actions";
import { actSetLoadedMoveListUrls, actSetSignedInEmail } from "app/actions";
import { actAddTips } from "tips/actions";
import { actAddMoveLists } from "move_lists/actions";

import { createErrorHandler, createToastr } from "app/utils";
import { AccountMenu } from "app/presentation/accountmenu";
import { navigate } from "@reach/router";
import Cookies from "js-cookie";

import Ctr from "screens/containers/index";
import { getObjectValues } from "utils/utils";
import { findMoveListByUrl, newMoveListSlug } from "screens/utils";

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
    const [email] = await Promise.all([Ctr.api.getEmail()]);
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
          Ctr.api.loadUserProfile(),
          Ctr.api.loadUserVotes(),
          Ctr.api.loadUserTags(),
          Ctr.api.loadMovePrivateDatas(),
        ]);
        props.dispatch(actSetUserProfile(profile));
        props.dispatch(actSetVotes(votes));
        props.dispatch(
          actSetMovePrivateDatas(
            movePrivateDatas.entities.movePrivateDatas || {}
          )
        );

        const [moveLists] = await Promise.all([
          Ctr.api.findMoveLists(profile.username),
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
        const [moveList] = await Promise.all([
          Ctr.api.loadMoveList(ownerUsername, slug),
        ]);
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
    Ctr.api
      .signOut()
      .catch(createErrorHandler("Could not update the move list"));
    props.dispatch(actSetSignedInEmail(""));
    navigate("/app/sign-in/");
  };

  const searchMovesBtn = (
    <div
      className={"button button--wide ml-2"}
      onClick={() => navigate("/app/search")}
    >
      Search
    </div>
  );

  const _acceptCookies = () => {
    Cookies.set("acceptCookies", 1);
    setAcceptsCookies(true);
  };

  const cookieNotice = Cookies.get("acceptCookies") ? (
    undefined
  ) : (
    <div className="cookieNotice">
      This site uses cookies. By continuing to use this site you agree with
      that.
      <button className="button button--wide ml-2" onClick={_acceptCookies}>
        Okay
      </button>
    </div>
  );

  return (
    <div className="appFrame px-4 flexcol">
      {cookieNotice}
      {createToastr()}
      <div className="appFrame__banner flexrow justify-between h-16">
        <h1 onClick={() => alert("TODO")}>Lindy Science</h1>
        {searchMovesBtn}
        <AccountMenu
          className=""
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
