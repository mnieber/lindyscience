// @flow

import React from "react";
import scrollIntoViewIfNeeded from "scroll-into-view-if-needed";
import ReduxToastr, { toastr } from "react-redux-toastr";
// $FlowFixMe
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import { stripQuotes } from "utils/utils";

import type { UserProfileT, UUID, TagT, ObjectT } from "app/types";

export function createToastr() {
  return (
    <ReduxToastr
      timeOut={4000}
      newestOnTop={false}
      preventDuplicates
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      progressBar={false}
    />
  );
}

export function isOwner(userProfile: UserProfileT, ownerId: number) {
  return userProfile && userProfile.userId == ownerId;
}

export function pickNeighbour(
  allItems: Array<any>,
  pickedItemId: UUID,
  isForward: boolean,
  pickItemById: (id: UUID) => void
) {
  const idx = allItems.findIndex(c => c.id === pickedItemId);

  if (isForward && idx + 1 < allItems.length) {
    pickItemById(allItems[idx + 1].id);
    return true;
  }
  if (!isForward && idx - 1 >= 0) {
    pickItemById(allItems[idx - 1].id);
    return true;
  }
  return false;
}

export function handleSelectionKeys(
  e: any,
  allItems: Array<any>,
  selectedItemId: UUID,
  selectItemById: (id: UUID) => void
) {
  const up = 38;
  const down = 40;
  if ([up, down].indexOf(e.keyCode) > -1) {
    e.stopPropagation();
    if (
      pickNeighbour(allItems, selectedItemId, e.keyCode == down, selectItemById)
    ) {
      e.preventDefault();
    }
    return true;
  }

  const pageUp = 33;
  const pageDown = 34;
  if ([pageUp, pageDown].indexOf(e.keyCode) > -1) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  return false;
}

export function scrollIntoView(elm: any, boundary: any) {
  if (elm) {
    return scrollIntoViewIfNeeded(elm, {
      block: "nearest",
      boundary: boundary,
    });
  }
}

export function tagStringToTags(tagString: string): Array<TagT> {
  return tagString
    .split(",")
    .map(x => stripQuotes(x.trim()))
    .filter(x => !!x);
}

export function createErrorHandler(msg: string) {
  return function(e: any) {
    console.log(msg, e);
    toastr.error("Oops!", msg);
  };
}

export function getId(x: ?ObjectT) {
  return x ? x.id : "";
}
