// @flow

import React from "react";
import {
  ContentState,
  EditorState,
  CharacterMetadata,
  convertFromRaw,
  // $FlowFixMe
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";

type MatchT = {
  startPos: number,
  startPos: number,
};

type CursorT = {
  charMap: Array<any>,
  pos: number,
};

function createCharMapVariations(allText: string) {
  const charMap = Array(allText.length).fill(".");
  let state = "none";
  let names = [];
  let name = "";

  for (var pos = 0; pos < allText.length; ++pos) {
    const c = allText[pos];

    if (state == "none") {
      if (c == "^") {
        state = "name";
        charMap[pos] = "sep1";
      } else {
        charMap[pos] = "t";
      }
    } else if (state == "name") {
      if (c == "^") {
        state = "description";
        charMap[pos] = "sep2";
        names = [...names, name];
        name = "";
      } else {
        charMap[pos] = "N";
        name += c;
      }
    } else if (state == "description") {
      if (c == "^") {
        state = "none";
        charMap[pos] = "sep3";
      } else {
        charMap[pos] = "D";
      }
    }
  }

  return {
    charMap,
    names,
  };
}

function createBlockWithVariations(block: any, cursor: CursorT): any {
  const text = block.getText();
  const chars = block.getCharacterList();

  let newText = "";
  let newChars = chars.clear();

  const variationNameStyle = CharacterMetadata.applyStyle(
    CharacterMetadata.create(),
    "VARIATION_NAME"
  );

  for (let idx = 0; idx < text.length; ++idx) {
    const mapValue = cursor.charMap[cursor.pos];
    cursor.pos += 1;

    if (mapValue == "N") {
      newText += text[idx];
      newChars = newChars.set(newChars.size, variationNameStyle);
    } else if (mapValue == "D") {
      newText += text[idx];
      newChars = newChars.set(
        newChars.size,
        CharacterMetadata.applyStyle(chars.get(idx), "VARIATION_DESCRIPTION")
      );
    } else if (mapValue == "t") {
      newText += text[idx];
      newChars = newChars.set(newChars.size, chars.get(idx));
    } else if (mapValue == "sep2") {
      newText += ": ";
      newChars = newChars.set(newChars.size, variationNameStyle);
      newChars = newChars.set(newChars.size, variationNameStyle);
    }
  }

  return block.set("text", newText).set("characterList", newChars);
}

function createBlockWithTimings(block: any, cursor: CursorT): any {
  const text = block.getText();
  const chars = block.getCharacterList();

  let newText = "";
  let newChars = chars.clear();

  const timingStyle = CharacterMetadata.applyStyle(
    CharacterMetadata.create(),
    "TIMING"
  );

  for (let idx = 0; idx < text.length; ++idx) {
    const mapValue = cursor.charMap[cursor.pos];
    cursor.pos += 1;

    if (mapValue == "D") {
      newText += text[idx];
      newChars = newChars.set(
        newChars.size,
        CharacterMetadata.applyStyle(chars.get(idx), "TIMED")
      );
    } else if (mapValue == "T") {
      newText += text[idx];
      newChars = newChars.set(newChars.size, timingStyle);
    } else if (mapValue == "t") {
      newText += text[idx];
      newChars = newChars.set(newChars.size, chars.get(idx));
    } else if (mapValue == "sep2") {
      newText += " [";
      newChars = newChars.set(newChars.size, timingStyle);
      newChars = newChars.set(newChars.size, timingStyle);
    } else if (mapValue == "sep3") {
      newText += "]";
      newChars = newChars.set(newChars.size, timingStyle);
    }
  }

  return block.set("text", newText).set("characterList", newChars);
}

function createCharMapTimings(allText: string) {
  const charMap = Array(allText.length).fill(".");
  let state = "none";

  for (var pos = 0; pos < allText.length; ++pos) {
    const c = allText[pos];

    if (state == "none") {
      if (c == "|") {
        state = "description";
        charMap[pos] = "sep1";
      } else {
        charMap[pos] = "t";
      }
    } else if (state == "description") {
      if (c == "|") {
        state = "timing";
        charMap[pos] = "sep2";
      } else {
        charMap[pos] = "D";
      }
    } else if (state == "timing") {
      if (c == "|") {
        state = "none";
        charMap[pos] = "sep3";
      } else {
        charMap[pos] = "T";
      }
    }
  }

  return {
    charMap,
  };
}

export function createReadOnlyBlocks(
  contentState: any
): { blocks: Array<any>, variationNames: Array<string> } {
  const blockMap = contentState.getBlockMap();

  let allText = "";
  blockMap.map((block, key) => {
    allText += block.getText();
  });

  const { charMap: charMapTimings } = createCharMapTimings(allText);
  const cursorTimings: CursorT = {
    charMap: charMapTimings,
    pos: 0,
  };

  allText = "";
  let newBlocks = blockMap.map((block, key) => {
    const newBlock = createBlockWithTimings(block, cursorTimings);
    allText += newBlock.getText();
    return newBlock;
  });

  const {
    charMap: charMapVariations,
    names: variationNames,
  } = createCharMapVariations(allText);
  const cursorVariations: CursorT = {
    charMap: charMapVariations,
    pos: 0,
  };

  newBlocks = newBlocks.map(block => {
    const newBlock = createBlockWithVariations(block, cursorVariations);
    return newBlock;
  });

  return { blocks: newBlocks, variationNames };
}

export function createReadOnlyEditorState(editorState: any) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const blockMap = contentState.getBlockMap();

  const { blocks: newBlocks, variationNames } = createReadOnlyBlocks(
    contentState
  );
  const newContentState = contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });

  return {
    state: EditorState.push(editorState, newContentState, "change-block-data"),
    variationNames,
  };
}

export function toContentState(text: string) {
  return text.startsWith("<")
    ? stateFromHTML(text)
    : convertFromRaw(JSON.parse(text));
}

export function toEditorState(text: string) {
  return text
    ? EditorState.createWithContent(toContentState(text))
    : EditorState.createEmpty();
}

export function toReadOnlyEditorState(text: string) {
  const editorState = toEditorState(text);
  const { state } = createReadOnlyEditorState(editorState);
  return state;
}
