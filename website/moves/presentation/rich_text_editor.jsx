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
  convertFromRaw,
  // $FlowFixMe
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { createReadOnlyEditorState } from "moves/utils/editor_state";

function customKeyBindingFn(e: any): string {
  return getDefaultKeyBinding(e);
}

type RichTextEditorPropsT = {
  content: string,
  autoFocus: boolean,
  readOnly: boolean,
  setEditorRef: any => void,
};

const styleMap = {
  TIMING: {
    fontSize: "0.85em",
    // fontWeight: "700",
    verticalAlign: "super",
  },
  TIMED: {
    textDecoration: "underline",
  },
  VARIATION: {
    backgroundColor: "#e8eff4",
  },
};

// TODO: before editing, convert from "draft" to "markdown".
// After editing, convert back.
// TODO: use Modifier.replaceText(selection, inlineStyle) to convert content to nicely styled readonly content
export function RichTextEditor(props: RichTextEditorPropsT) {
  const editorRef = React.useRef(null);
  props.setEditorRef(editorRef);

  const [writableEditorState, setWritableEditorState] = React.useState(
    EditorState.createWithContent(
      props.content.startsWith("<")
        ? stateFromHTML(props.content)
        : convertFromRaw(JSON.parse(props.content))
    )
  );

  const [readOnlyEditorState, setReadOnlyEditorState] = React.useState(
    createReadOnlyEditorState(writableEditorState)
  );

  const setEditorState = editorState => {
    setWritableEditorState(editorState);
    setReadOnlyEditorState(createReadOnlyEditorState(editorState));
  };

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

  const _onChange = newState => {
    setEditorState(newState);
  };

  return (
    <Editor
      ref={editorRef}
      editorState={props.readOnly ? readOnlyEditorState : writableEditorState}
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={customKeyBindingFn}
      onChange={_onChange}
      readOnly={props.readOnly}
      customStyleMap={styleMap}
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
