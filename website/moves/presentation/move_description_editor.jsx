// @flow

import * as React from "react";
import classnames from "classnames";
import {
  EditorState,
  Modifier,
  KeyBindingUtil,
  // $FlowFixMe
} from "draft-js";

import { RichTextEditor } from "rich_text/presentation/rich_text_editor";
import { roundDecimals } from "utils/utils";
import {
  toReadOnlyEditorState,
  toEditorState,
} from "rich_text/utils/editor_state";
import { createTimePointDecorator } from "video/presentation/timepoint_decorator";

import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";

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

type MoveDescriptionEditorPropsT = {
  editorId: UUID,
  description: string,
  readOnly: boolean,
  autoFocus?: boolean,
  videoPlayer?: any,
  editorRef?: any,
  placeholder?: string,
};

export function MoveDescriptionEditor(props: MoveDescriptionEditorPropsT) {
  const decorator = props.videoPlayer
    ? createTimePointDecorator(props.videoPlayer)
    : null;

  const toEditorStateFunction = props.readOnly
    ? toReadOnlyEditorState
    : toEditorState;

  const readOnlyEditorState = toEditorStateFunction(
    props.description,
    decorator
  );

  const keyPostfix = props.videoPlayer ? props.videoPlayer.getVideoUrl() : "";

  const customHandleKeyCommand = (command, editorState) => {
    if (command == "insert-timepoint" && props.videoPlayer) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      // $FlowFixMe
      const t = roundDecimals(props.videoPlayer.getCurrentTime(), 1);
      const newContentState = Modifier.insertText(
        contentState,
        selectionState,
        "<" + t + "> "
      );
      return EditorState.push(editorState, newContentState, "insert-fragment");
    }
    return null;
  };

  const customKeyBindingFn = e => {
    if (
      e.keyCode === 83 /* `S` key */ &&
      KeyBindingUtil.hasCommandModifier(e)
    ) {
      return "insert-timepoint";
    }
    return null;
  };

  const dummySetEditorRef = () => {};

  return (
    <RichTextEditor
      key={props.editorId + keyPostfix} // yes, we need this
      initialEditorState={readOnlyEditorState}
      customHandleKeyCommand={customHandleKeyCommand}
      customKeyBindingFn={customKeyBindingFn}
      readOnly={props.readOnly}
      autoFocus={!!props.autoFocus}
      ref={props.editorRef}
      customStyleMap={styleMap}
      placeholder={props.placeholder}
    />
  );
}
