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
  buttons?: Array<React.Node>,
  small: boolean,
};

export function MoveHeader(props: MoveHeaderPropsT) {
  const smallButtons = <div className="flexrow">{props.buttons}</div>;

  const nameDiv = (
    <div
      className={classnames("items-center w-full", {
        flexrow: !props.small,
        flexcol: props.small,
      })}
    >
      {props.moveListTitle}
      <h1 className="flex-none ml-2">{props.move.name}</h1>
      {props.small ? smallButtons : props.buttons}
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
