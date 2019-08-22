// @flow

import React from "react";
import { AccountMenu } from "app/presentation/accountmenu";
import { navigate } from "@reach/router";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";
import VotesCtr from "votes/containers/index";
import ProfilesCtr from "Profiles/containers/index";

import { createErrorHandler } from "app/utils";
import { getObjectValues } from "utils/utils";
import { createToastr } from "app/utils";
import { findMoveListByUrl, newMoveListSlug } from "moves/utils";

import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "moves/types";

// AppFrame
type AppFramePropsT = {
  moveLists: Array<MoveListT>,
  selectedMoveListUrl: string,
  userProfile: ?UserProfileT,
  signedInEmail: string,
  loadedMoveListUrls: Array<string>,
  children: any,
  // also receive any actions
};

function AppFrame(props: AppFramePropsT) {
  const actions: any = props;

  const [loadedEmail, setLoadedEmail] = React.useState("");

  async function _loadEmail() {
    const [email] = await Promise.all([AppCtr.api.getEmail()]);
    if (email) {
      actions.actSetSignedInEmail(email);
    }
  }

  async function _loadUserProfile() {
    if (!!props.signedInEmail && loadedEmail != props.signedInEmail) {
      const [profile, votes, tags, movePrivateDatas] = await Promise.all([
        ProfilesCtr.api.loadUserProfile(),
        VotesCtr.api.loadUserVotes(),
        ProfilesCtr.api.loadUserTags(),
        MovesCtr.api.loadMovePrivateDatas(),
      ]);
      actions.actSetUserProfile(profile);
      VotesCtr.actions.actSetVotes(votes);
      actions.actSetMovePrivateDatas(
        movePrivateDatas.entities.movePrivateDatas || {}
      );

      const [moveLists] = await Promise.all([
        MovesCtr.api.findMoveLists(profile.username),
      ]);
      actions.actAddMoveLists(moveLists.entities.moveLists || {});

      setLoadedEmail(props.signedInEmail);
    }
  }

  async function _loadSelectedMoveList() {
    if (
      !!props.selectedMoveListUrl &&
      !props.loadedMoveListUrls.includes(props.selectedMoveListUrl)
    ) {
      const moveListInStore = findMoveListByUrl(
        props.moveLists,
        props.selectedMoveListUrl
      );

      if (moveListInStore && moveListInStore.slug != newMoveListSlug) {
        const [moveList] = await Promise.all([
          MovesCtr.api.loadMoveList(moveListInStore.id),
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
    AppCtr.api
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

  return (
    <div className="appFrame px-4 flex flex-col">
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
AppFrame = MovesCtr.connect(
  state => ({
    moveLists: MovesCtr.fromStore.getFilteredMoveLists(state),
    userProfile: ProfilesCtr.fromStore.getUserProfile(state),
    signedInEmail: AppCtr.fromStore.getSignedInEmail(state),
    selectedMoveListUrl: MovesCtr.fromStore.getSelectedMoveListUrl(state),
    loadedMoveListUrls: AppCtr.fromStore.getLoadedMoveListUrls(state),
  }),
  {
    ...MovesCtr.actions,
    ...AppCtr.actions,
    ...VotesCtr.actions,
    ...ProfilesCtr.actions,
  }
)(AppFrame);

export default AppFrame;
