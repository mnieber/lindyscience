// @flow

import * as React from "react";
import { compose } from "redux";

import { withMovesCtr } from "screens/moves_container/moves_container_context";
import { withMoveListsCtr } from "screens/movelists_container/movelists_container_context";
import type { OwnedT } from "kernel/types";
import { isOwner } from "app/utils";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { Editing } from "facet-mobx/facets/editing";
import { Highlight } from "facet-mobx/facets/highlight";
import { withSessionCtr } from "screens/session_container/session_container_context";
import { SessionContainer } from "screens/session_container/session_container";
import type { UserProfileT } from "profiles/types";

export function getSessionCtrDefaultProps(sessionCtr: SessionContainer) {
  return {
    userProfile: () => sessionCtr.inputs.userProfile,
    navigation: () => sessionCtr.navigation,
    display: () => sessionCtr.display,
    profiling: () => sessionCtr.profiling,
    sessionCtr: () => sessionCtr,
    isOwner: () => (x: OwnedT) => {
      const userProfile = sessionCtr.inputs.userProfile;
      return userProfile && isOwner(userProfile, x.ownerId);
    },
  };
}

export function getMovesCtrDefaultProps(movesCtr: MovesContainer) {
  return {
    movesCtr: () => movesCtr,
    isEditingMove: () => Editing.get(movesCtr).isEditing,
    move: () => Highlight.get(movesCtr).item,
    moves: () => movesCtr.outputs.display,
    movesPreview: () => movesCtr.outputs.preview,
    movesEditing: () => movesCtr.editing,
    movesDragging: () => movesCtr.dragging,
    movesHighlight: () => movesCtr.highlight,
    movesSelection: () => movesCtr.selection,
    movesClipboard: () => movesCtr.clipboard,
    movesFiltering: () => movesCtr.filtering,
    movesAddition: () => movesCtr.addition,
  };
}

export function getMoveListsCtrDefaultProps(moveListsCtr: MoveListsContainer) {
  return {
    moveListsCtr: () => moveListsCtr,
    isEditingMoveList: () => Editing.get(moveListsCtr).isEditing,
    moveList: () => Highlight.get(moveListsCtr).item,
    moveLists: () => moveListsCtr.outputs.display,
    moveListsPreview: () => moveListsCtr.outputs.preview,
    moveListsEditing: () => moveListsCtr.editing,
    moveListsHighlight: () => moveListsCtr.highlight,
    moveListsSelection: () => moveListsCtr.selection,
    moveListsLabelling: () => moveListsCtr.labelling,
    moveListsAddition: () => moveListsCtr.addition,
  };
}

// $FlowFixMe
export const withDefaultProps = compose(
  withSessionCtr,
  // TODO: make session.movesCtr observable and use observer?
  withMovesCtr,
  withMoveListsCtr,
  (WrappedComponent: any) => props => {
    const sessionCtrProps = getSessionCtrDefaultProps(props.sessionCtr);
    const movesCtrProps = props.movesCtr
      ? getMovesCtrDefaultProps(props.movesCtr)
      : {};
    const moveListsCtrProps = props.moveListsCtr
      ? getMoveListsCtrDefaultProps(props.moveListsCtr)
      : {};

    const defaultProps = {
      ...sessionCtrProps,
      ...movesCtrProps,
      ...moveListsCtrProps,
    };

    return <WrappedComponent defaultProps={defaultProps} {...props} />;
  }
);

export const mergeDefaultProps = <T>(props: any): T => {
  if (!props.defaultProps) {
    console.error("No default props: ", props);
  }
  return new Proxy(props, {
    get: function(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      if (prop in props.defaultProps) {
        return props.defaultProps[prop]();
      }
      return undefined;
    },
  });
};
