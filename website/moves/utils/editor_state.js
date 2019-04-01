// @flow

import React from "react";
// $FlowFixMe
import { ContentState, EditorState, CharacterMetadata } from "draft-js";

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    if (matchArr) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  }
}

function findTimings(contentBlock, callback) {
  const TIMING_REGEX = /\|[^\|]+\|[^\|]+\|/g;
  findWithRegex(TIMING_REGEX, contentBlock, callback);
}

function useBlock(block) {
  const oldData = {
    text: block.getText(),
    chars: block.getCharacterList(),
  };

  const newData = {
    text: "",
    chars: oldData.chars.clear(),
  };

  const take = (start, end, extraStyle = undefined) => {
    newData.text += oldData.text.substring(start, end);
    for (let idx = start; idx < end; ++idx) {
      const currentStyle = oldData.chars.get(idx);
      newData.chars = newData.chars.set(
        newData.chars.size,
        extraStyle
          ? CharacterMetadata.applyStyle(currentStyle, extraStyle)
          : currentStyle
      );
    }
  };

  const append = (part, characterMetadata) => {
    newData.text += part;
    for (let idx = 0; idx < part.length; ++idx) {
      newData.chars = newData.chars.set(newData.chars.size, characterMetadata);
    }
  };

  return {
    oldData,
    newData,
    take,
    append,
  };
}

export function createReadOnlyEditorState(editorState: any) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const blockMap = contentState.getBlockMap();

  // $FlowFixMe
  const newBlocks = blockMap.map((block, key) => {
    const { oldData, newData, take, append } = useBlock(block);
    let start = 0;
    let end = oldData.text.length;

    const onMatch = (matchStart, matchEnd) => {
      const [part, timing] = oldData.text
        .substring(matchStart + 1, matchEnd - 1)
        .split("|");

      take(start, matchStart);
      take(matchStart + 1, matchStart + 1 + part.length, "TIMED");

      const timingStyle = CharacterMetadata.applyStyle(
        CharacterMetadata.create(),
        "TIMING"
      );

      append(
        " [" +
          oldData.text.substring(
            matchStart + 1 + part.length + 1,
            matchEnd - 1,
            timingStyle
          ) +
          "] ",
        timingStyle
      );

      start = matchEnd;
    };

    findTimings(block, onMatch);
    take(start, oldData.text.length);

    return block.set("text", newData.text).set("characterList", newData.chars);
  });

  const newContentState = contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });

  return EditorState.push(editorState, newContentState, "change-block-data");
}
