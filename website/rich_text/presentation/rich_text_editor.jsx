// @flow

import React from "react";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  CompositeDecorator,
  convertToRaw,
  // $FlowFixMe
} from "draft-js";

function customKeyBindingFn(e: any): string {
  return getDefaultKeyBinding(e);
}

type RichTextEditorPropsT = {
  initialEditorState: any,
  autoFocus: boolean,
  readOnly: boolean,
  setEditorRef: any => void,
  customStyleMap?: any,
  placeholder?: string,
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
    const newState = RichUtils.handleKeyCommand(editorState, command);

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
