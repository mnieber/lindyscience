// @flow

import React from "react";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertToRaw,
  // $FlowFixMe
} from "draft-js";
import { roundDecimals } from "utils/utils";

function customKeyBindingFn(e: any): string {
  if (e.keyCode === 83 /* `S` key */ && KeyBindingUtil.hasCommandModifier(e)) {
    return "insert-timepoint";
  }
  return getDefaultKeyBinding(e);
}

type RichTextEditorPropsT = {
  initialEditorState: any,
  autoFocus: boolean,
  readOnly: boolean,
  setEditorRef: any => void,
  customStyleMap?: any,
  placeholder?: string,
  getCurrentTime?: () => number,
};

// TODO: before editing, convert from "draft" to "markdown".
// After editing, convert back.
// TODO: use Modifier.replaceText(selection, inlineStyle) to convert content to nicely styled readonly content
export function RichTextEditor(props: RichTextEditorPropsT) {
  const editorRef = React.useRef(null);
  props.setEditorRef(editorRef);

  const [editorState, setEditorState] = React.useState(
    props.initialEditorState
  );

  const _setEditorState = editorState => {
    setEditorState(editorState);
  };

  React.useEffect(() => {
    if (props.autoFocus && editorRef && editorRef.current) {
      editorRef.current.focus();
    }
  }, [editorRef]);

  const handleKeyCommand = (command, editorState) => {
    let newState = null;

    if (command == "insert-timepoint" && props.getCurrentTime) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      // $FlowFixMe
      const t = roundDecimals(props.getCurrentTime(), 1);
      const newContentState = Modifier.insertText(
        contentState,
        selectionState,
        "<" + t + "> "
      );
      newState = EditorState.push(
        editorState,
        newContentState,
        "insert-fragment"
      );
    } else {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      _setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <Editor
      ref={editorRef}
      editorState={editorState}
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={customKeyBindingFn}
      onChange={_setEditorState}
      readOnly={props.readOnly}
      customStyleMap={props.customStyleMap}
      placeholder={props.placeholder}
    />
  );
}

export function getContentFromEditor(editor: any, defaultValue: string) {
  if (!editor) {
    return defaultValue;
  }
  return JSON.stringify(
    convertToRaw(editor.props.editorState.getCurrentContent())
  );
}
