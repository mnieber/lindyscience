import {
  Editor,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
} from 'draft-js';
import React from 'react';

import { isNone } from 'src/utils/utils';

type PropsT = {
  initialEditorState: any;
  autoFocus: boolean;
  readOnly: boolean;
  forwardedRef?: any;
  customStyleMap?: any;
  placeholder?: string;
  customHandleKeyCommand?: Function;
  customKeyBindingFn?: Function;
  ref?: any;
};

// TODO: use Modifier.replaceText(selection, inlineStyle) to convert content to nicely styled readonly content
function RichTextEditor_(props: PropsT) {
  const [editorState, setEditorState] = React.useState(
    props.initialEditorState
  );

  const _setEditorState = (editorState) => {
    setEditorState(editorState);
  };

  React.useEffect(() => {
    if (props.autoFocus && props.forwardedRef && props.forwardedRef.current) {
      props.forwardedRef.current.focus();
    }
  }, [props.forwardedRef]);

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
      return 'handled';
    }
    return 'not-handled';
  };

  function customKeyBindingFn(e: any): string {
    const command = props.customKeyBindingFn
      ? props.customKeyBindingFn(e)
      : null;

    return (!isNone(command) ? command : getDefaultKeyBinding(e)) || '';
  }

  return (
    <Editor
      ref={props.forwardedRef}
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

export const RichTextEditor: React.FC<PropsT> = React.forwardRef(
  (props, ref) => {
    return <RichTextEditor_ {...props} forwardedRef={ref} />;
  }
);
