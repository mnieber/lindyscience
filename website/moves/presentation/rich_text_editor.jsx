// @flow

import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  // $FlowFixMe
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";

type RichTextEditorPropsT = {
  content: string,
  autoFocus: boolean,
  setEditorRef: any => void,
};

export function RichTextEditor(props: RichTextEditorPropsT) {
  const editorRef = React.useRef(null);
  props.setEditorRef(editorRef);

  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(stateFromHTML(props.content))
  );

  React.useEffect(() => {
    if (props.autoFocus && editorRef && editorRef.current) {
      editorRef.current.focus();
    }
  }, [editorRef]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <Editor
      ref={editorRef}
      editorState={editorState}
      handleKeyCommand={handleKeyCommand}
      onChange={setEditorState}
    />
  );
}

export function getContentFromEditor(editor: any, defaultValue: string) {
  if (!editor) {
    return defaultValue;
  }
  return stateToHTML(editor.props.editorState.getCurrentContent());
}
