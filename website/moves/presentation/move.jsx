// @flow

import * as React from "react";
import classnames from "classnames";

import { RichTextEditor } from "rich_text/presentation/rich_text_editor";
import {
  createReadOnlyEditorState,
  toEditorState,
} from "rich_text/utils/editor_state";

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
};

export function Move(props: MovePropsT) {
  const readOnlyEditorState = createReadOnlyEditorState(
    toEditorState(props.move.description)
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
