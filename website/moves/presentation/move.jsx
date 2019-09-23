// @flow

import * as React from "react";
import classnames from "classnames";

import { MoveDescriptionEditor } from "moves/presentation/move_description_editor";
import { toReadOnlyEditorState } from "rich_text/utils/editor_state";
import { createTimePointDecorator } from "video/presentation/timepoint_decorator";

import type { MoveT } from "moves/types";

const styleMap = {
  TIMING: {
    fontSize: "0.85em",
    // fontWeight: "700",
    verticalAlign: "super",
  },
  TIMED: {
    textDecoration: "underline",
  },
};

// Move

type MovePropsT = {
  move: MoveT,
  className?: string,
  videoPlayer?: any,
};

export function Move(props: MovePropsT) {
  const descriptionDiv = (
    <div className={"move__description panel"}>
      <h2>Description</h2>
      <MoveDescriptionEditor
        description={props.move.description}
        readOnly={true}
        autoFocus={false}
        videoPlayer={props.videoPlayer}
      />
    </div>
  );

  return (
    <div className={classnames("move", props.className || "")}>
      {descriptionDiv}
    </div>
  );
}
