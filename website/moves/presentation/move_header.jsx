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
  className?: string,
};

export function MoveHeader(props: MoveHeaderPropsT) {
  const nameDiv = (
    <div className="flexrow items-center w-full">
      {props.moveListTitle}
      <h2>:</h2>
      <h1 className="flex-none ml-2">{props.move.name}</h1>
      {props.buttons}
    </div>
  );

  const tagsDiv = props.move.tags.length ? (
    <Tags tags={props.move.tags} />
  ) : (
    undefined
  );

  return (
    <div className={classnames("move__header", props.className || "")}>
      {nameDiv}
      {tagsDiv}
    </div>
  );
}
