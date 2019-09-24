// @flow

import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  // $FlowFixMe
} from "draft-js";
import { isNone } from "utils/utils";

type RichTextEditorPropsT = {
  initialEditorState: any,
  autoFocus: boolean,
  readOnly: boolean,
  setEditorRef: any => void,
  customStyleMap?: any,
  placeholder?: string,
  customHandleKeyCommand?: Function,
  customKeyBindingFn?: Function,
};

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

    if (props.customHandleKeyCommand) {
      newState = props.customHandleKeyCommand(command, editorState);
    }

    if (isNone(newState)) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      _setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  function customKeyBindingFn(e: any): string {
    const command = props.customKeyBindingFn
      ? props.customKeyBindingFn(e)
      : null;

    return !isNone(command) ? command || "" : getDefaultKeyBinding(e);
  }

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
