// @flow

import * as React from "react";
import classnames from "classnames";

import { Tags } from "tags/presentation/tags";

import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";

// MoveHeader

type MoveHeaderPropsT = {
  move: MoveT,
  moveListTitle: any,
  moveTags: Array<TagT>,
  editMoveBtn: any,
  followMoveListBtn: any,
  small: boolean,
};

export function MoveHeader(props: MoveHeaderPropsT) {
  const space = <div key="space" className={classnames("flex flex-grow")} />;

  const nameDiv = (
    <div
      className={classnames("items-center w-full", {
        flexrow: !props.small,
        flexcol: props.small,
      })}
    >
      {props.moveListTitle}
      <div
        className={classnames("flexrow items-center", {
          "flex-grow": true,
        })}
      >
        {props.small && props.editMoveBtn}
        <h1 className="flex-none ml-2">{props.move.name}</h1>
        {!props.small && props.editMoveBtn}
        {!props.small && space}
        {!props.small && props.followMoveListBtn}
      </div>
    </div>
  );

  const tagsDiv = props.move.tags.length ? (
    <Tags tags={props.move.tags} />
  ) : (
    undefined
  );

  return (
    <div className={classnames("move__header")}>
      {nameDiv}
      {tagsDiv}
    </div>
  );
}
