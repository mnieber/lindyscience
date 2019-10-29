// @flow

import * as React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";

import { MoveDescriptionEditor } from "moves/presentation/move_description_editor";

import type { MoveT } from "moves/types";

// Move

type MovePropsT = {
  move: MoveT,
  className?: string,
  videoPlayer?: any,
};

export function Move(props: MovePropsT) {
  const descriptionDiv = (
    <div>
      <div className="flexrow">
        Created by:
        <Link
          className="ml-2 mb-2"
          to={"/app/people/" + props.move.ownerUsername}
        >
          {props.move.ownerUsername}
        </Link>
      </div>
      <div id="move__description" className={"move__description panel"}>
        <h2>Description</h2>
        <MoveDescriptionEditor
          editorId={"move_" + props.move.id}
          description={props.move.description}
          readOnly={true}
          autoFocus={false}
          videoPlayer={props.videoPlayer}
        />
      </div>
    </div>
  );

  return (
    <div className={classnames("move", props.className || "")}>
      {descriptionDiv}
    </div>
  );
}
