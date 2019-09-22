// @flow

import * as React from "react";
import classnames from "classnames";

import { RichTextEditor } from "rich_text/presentation/rich_text_editor";
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
  const decorator = props.videoPlayer
    ? createTimePointDecorator(props.videoPlayer)
    : null;
  const readOnlyEditorState = toReadOnlyEditorState(
    props.move.description,
    decorator
  );

  const descriptionDiv = (
    <div className={"move__description panel"}>
      <h2>Description</h2>
      <RichTextEditor
        key={props.move.id}
        initialEditorState={readOnlyEditorState}
        readOnly={true}
        autoFocus={false}
        setEditorRef={() => {}}
        customStyleMap={styleMap}
      />
    </div>
  );

  return (
    <div className={classnames("move", props.className || "")}>
      {descriptionDiv}
    </div>
  );
}
