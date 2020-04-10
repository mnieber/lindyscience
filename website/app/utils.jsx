// @flow

import React from "react";
import scrollIntoViewIfNeeded from "scroll-into-view-if-needed";
import ReduxToastr, { toastr } from "react-redux-toastr";

import type { ObjectT, OwnedObjectT, UUID } from "kernel/types";
import { makeIdMatcher } from "screens/utils";
import { stripQuotes } from "utils/utils";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";

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

export function pickNeighbour2(
  allItems: Array<any>,
  pickedItem: any,
  isForward: boolean,
  pickItem: (x: any) => void
) {
  const idx = allItems.findIndex(x => x === pickedItem);

  if (isForward && idx + 1 < allItems.length) {
    pickItem(allItems[idx + 1]);
    return true;
  }
  if (!isForward && idx - 1 >= 0) {
    pickItem(allItems[idx - 1]);
    return true;
  }
  return false;
}

export function handleSelectionKeys2(
  key: string,
  e: any,
  allItems: Array<any>,
  selectedItem: any,
  selectItem: (x: any) => void
) {
  if (["up", "down"].includes(key)) {
    e.stopPropagation();
    if (pickNeighbour2(allItems, selectedItem, key == "down", selectItem)) {
      e.preventDefault();
    }
    return true;
  }

  const pageUp = 33;
  const pageDown = 34;
  if ([pageUp, pageDown].includes(e.keyCode)) {
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
    (console: any).log(msg, e);
    toastr.error("Oops!", msg);
  };
}

export function getId(x: ?ObjectT) {
  return x ? x.id : "";
}

export function getIds(x: Array<ObjectT>): Array<UUID> {
  return x.map(x => x.id);
}

export function idTable(items: Array<any>): Function {
  return id => items.find(x => x.id == id);
}

export function getOwnerId(x: ?OwnedObjectT): number {
  return x ? x.ownerId : -1;
}

export function last(x: Array<any>): any {
  return x[x.length - 1];
}
