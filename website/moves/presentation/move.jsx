// @flow

import * as React from "react";
import classnames from "classnames";

import { RichTextEditor } from "rich_text/presentation/rich_text_editor";
import { Tags } from "tags/presentation/tags";
import {
  createReadOnlyEditorState,
  toEditorState,
} from "rich_text/utils/editor_state";

import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";

const styleMap = {
  TIMING: {
    fontSize: "0.85em",
    // fontWeight: "700",
    verticalAlign: "super",
  },
  TIMED: {
    textDecoration: "underline",
  },
  VARIATION_NAME: {
    backgroundColor: "#e8eff4",
  },
  VARIATION_DESCRIPTION: {
    backgroundColor: "#d8eff4",
  },
};

// Move

type MovePropsT = {
  move: MoveT,
  moveListTitle: any,
  moveTags: Array<TagT>,
  buttons?: Array<React.Node>,
  className?: string,
  hostedPanels: any,
  videoPlayerPanel: any,
};

export function Move(props: MovePropsT) {
  const nameDiv = (
    <div className="flex flex-row items-center">
      {props.moveListTitle}
      <h2>:</h2>
      <div className={"move__name flexrow flex-wrap ml-2"}>
        <h1>{props.move.name}</h1>
        {props.buttons}
      </div>
    </div>
  );

  const tagsDiv = props.move.tags.length ? (
    <Tags tags={props.move.tags} />
  ) : (
    undefined
  );

  const {
    state: readOnlyEditorState,
    variationNames,
  } = createReadOnlyEditorState(toEditorState(props.move.description));

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
      {nameDiv}
      {tagsDiv}
      {descriptionDiv}
      {props.videoPlayerPanel}
      {props.hostedPanels}
    </div>
  );
}
