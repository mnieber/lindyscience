// @flow

import React from "react";
import { AccountMenu } from "app/presentation/accountmenu";
import { navigate } from "@reach/router";
import Cookies from "js-cookie";

import Ctr from "screens/containers/index";

import { createErrorHandler } from "app/utils";
import { getObjectValues } from "utils/utils";
import { createToastr } from "app/utils";
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
  // also receive any actions
};

function AppFrame(props: AppFramePropsT) {
  const actions: any = props;

  const [acceptsCookies, setAcceptsCookies] = React.useState(false);

  const [loadedEmail, setLoadedEmail] = React.useState("");
  const [loadingMoveListUrls, setLoadingMoveListUrls] = React.useState([]);

  async function _loadEmail() {
    const [email] = await Promise.all([Ctr.api.getEmail()]);
    actions.actSetSignedInEmail(email ? email : "anonymous");
  }

  async function _loadUserProfile() {
    if (!!props.signedInEmail && loadedEmail != props.signedInEmail) {
      if (props.signedInEmail === "anonymous") {
        actions.actSetUserProfile(undefined);
        actions.actSetVotes({});
        actions.actSetMovePrivateDatas({});
      } else {
        const [profile, votes, tags, movePrivateDatas] = await Promise.all([
          Ctr.api.loadUserProfile(),
          Ctr.api.loadUserVotes(),
          Ctr.api.loadUserTags(),
          Ctr.api.loadMovePrivateDatas(),
        ]);
        actions.actSetUserProfile(profile);
        actions.actSetVotes(votes);
        actions.actSetMovePrivateDatas(
          movePrivateDatas.entities.movePrivateDatas || {}
        );

        const [moveLists] = await Promise.all([
          Ctr.api.findMoveLists(profile.username),
        ]);
        actions.actAddMoveLists(moveLists.entities.moveLists || {});
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
        actions.actAddMoves(getObjectValues(moveList.entities.moves || {}));
        actions.actAddMoveLists(moveList.entities.moveLists);
        actions.actAddVideoLinks(moveList.entities.videoLinks || {});
        actions.actAddTips(moveList.entities.tips || {});
        actions.actSetLoadedMoveListUrls([
          ...props.loadedMoveListUrls,
          props.selectedMoveListUrl,
        ]);
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
    actions.actSetSignedInEmail("");
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
    <div className="appFrame px-4 flex flex-col">
      {cookieNotice}
      {createToastr()}
      <div className="appFrame__banner flex flex-row justify-between h-16">
        <h1 onClick={() => alert("TODO")}>Lindy Science</h1>
        {searchMovesBtn}
        <AccountMenu
          className=""
          userProfile={props.userProfile}
          signIn={() => navigate("/app/sign-in/")}
          signOut={signOut}
        />
      </div>
      {props.children}
    </div>
  );
}

// $FlowFixMe
AppFrame = Ctr.connect(
  state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    signedInEmail: Ctr.fromStore.getSignedInEmail(state),
    selectedMoveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
    loadedMoveListUrls: Ctr.fromStore.getLoadedMoveListUrls(state),
  }),
  Ctr.actions
)(AppFrame);

export default AppFrame;
