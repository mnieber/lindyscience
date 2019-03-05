import React from 'react'
import {
  Editor, EditorState, RichUtils, convertFromRaw, convertToRaw
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';


export function _RichTextEditor(props) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(stateFromHTML(props.content))
  );

  React.useEffect(
    () => {
      if (props.autoFocus && props.editorRef && props.editorRef.current) {
        props.editorRef.current.focus();
      }
    }
    , [props.editorRef]
  );

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  return (
      <Editor
        ref={props.editorRef}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
      />
  );
}

// $FlowFixMe
export const RichTextEditor = React.forwardRef(
  (props, editorRef) => _RichTextEditor({...props, editorRef})
);


export function getContentFromEditor(editor: any, defaultValue: string) {
  if (!editor) {
    return defaultValue;
  }
  return stateToHTML(editor.props.editorState.getCurrentContent());
}
