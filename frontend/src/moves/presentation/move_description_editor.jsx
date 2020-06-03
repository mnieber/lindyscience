// @flow

import * as React from 'react';
import {
  EditorState,
  Modifier,
  KeyBindingUtil,
  // $FlowFixMe
} from 'draft-js';

import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { RichTextEditor } from 'src/rich_text/presentation/rich_text_editor';
import { roundDecimals } from 'src/utils/utils';
import {
  toReadOnlyEditorState,
  toEditorState,
} from 'src/rich_text/utils/editor_state';
import { createTimePointDecorator } from 'src/video/presentation/timepoint_decorator';
import type { UUID } from 'src/kernel/types';

const styleMap = {
  TIMING: {
    fontSize: '0.85em',
    // fontWeight: "700",
    verticalAlign: 'super',
  },
  TIMED: {
    textDecoration: 'underline',
  },
};

// Move

type PropsT = {
  editorId: UUID,
  description: string,
  readOnly: boolean,
  autoFocus?: boolean,
  videoController?: VideoController,
  editorRef?: any,
  placeholder?: string,
};

export function MoveDescriptionEditor(props: PropsT) {
  const decorator = props.videoController
    ? createTimePointDecorator(props.videoController)
    : null;

  const toEditorStateFunction = props.readOnly
    ? toReadOnlyEditorState
    : toEditorState;

  const readOnlyEditorState = toEditorStateFunction(
    props.description,
    decorator
  );

  const keyPostfix =
    props.videoController && props.videoController.player
      ? props.videoController.player.getVideoUrl()
      : '';

  const customHandleKeyCommand = (command, editorState) => {
    const player = props.videoController?.player;

    if (command == 'insert-timepoint' && player) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const t = roundDecimals(player.getCurrentTime(), 1);
      const newContentState = Modifier.insertText(
        contentState,
        selectionState,
        '<' + t + '> '
      );
      return EditorState.push(editorState, newContentState, 'insert-fragment');
    }
    return null;
  };

  const customKeyBindingFn = (e) => {
    if (
      e.keyCode === 83 /* `S` key */ &&
      KeyBindingUtil.hasCommandModifier(e)
    ) {
      return 'insert-timepoint';
    }
    return null;
  };

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
