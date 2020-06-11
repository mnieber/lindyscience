// @flow

// $FlowFixMe
import { EditorState, CharacterMetadata, convertFromRaw } from 'draft-js';
// $FlowFixMe
import { stateFromHTML } from 'draft-js-import-html';

type MatchT = {
  startPos: number,
  startPos: number,
};

type CursorT = {
  charMap: Array<any>,
  pos: number,
};

function createBlockWithTimings(block: any, cursor: CursorT): any {
  const text = block.getText();
  const chars = block.getCharacterList();

  let newText = '';
  let newChars = chars.clear();

  const timingStyle = CharacterMetadata.applyStyle(
    CharacterMetadata.create(),
    'TIMING'
  );

  for (let idx = 0; idx < text.length; ++idx) {
    const mapValue = cursor.charMap[cursor.pos];
    cursor.pos += 1;

    if (mapValue == 'D') {
      newText += text[idx];
      newChars = newChars.set(
        newChars.size,
        CharacterMetadata.applyStyle(chars.get(idx), 'TIMED')
      );
    } else if (mapValue == 'T') {
      newText += text[idx];
      newChars = newChars.set(newChars.size, timingStyle);
    } else if (mapValue == 't') {
      newText += text[idx];
      newChars = newChars.set(newChars.size, chars.get(idx));
    } else if (mapValue == 'sep2') {
      newText += ' [';
      newChars = newChars.set(newChars.size, timingStyle);
      newChars = newChars.set(newChars.size, timingStyle);
    } else if (mapValue == 'sep3') {
      newText += ']';
      newChars = newChars.set(newChars.size, timingStyle);
    }
  }

  return block.set('text', newText).set('characterList', newChars);
}

function createCharMapTimings(allText: string) {
  const charMap = Array(allText.length).fill('.');
  let state = 'none';

  for (var pos = 0; pos < allText.length; ++pos) {
    const c = allText[pos];

    if (state == 'none') {
      if (c == '|') {
        state = 'description';
        charMap[pos] = 'sep1';
      } else {
        charMap[pos] = 't';
      }
    } else if (state == 'description') {
      if (c == '|') {
        state = 'timing';
        charMap[pos] = 'sep2';
      } else {
        charMap[pos] = 'D';
      }
    } else if (state == 'timing') {
      if (c == '|') {
        state = 'none';
        charMap[pos] = 'sep3';
      } else {
        charMap[pos] = 'T';
      }
    }
  }

  return {
    charMap,
  };
}

export function createReadOnlyBlocks(contentState: any): Array<any> {
  const blockMap = contentState.getBlockMap();

  let allText = '';
  blockMap.map((block, key) => {
    allText += block.getText();
  });

  const { charMap: charMapTimings } = createCharMapTimings(allText);
  const cursorTimings: CursorT = {
    charMap: charMapTimings,
    pos: 0,
  };

  allText = '';
  let newBlocks = blockMap.map((block, key) => {
    const newBlock = createBlockWithTimings(block, cursorTimings);
    allText += newBlock.getText();
    return newBlock;
  });

  return newBlocks;
}

export function createReadOnlyEditorState(editorState: any) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const blockMap = contentState.getBlockMap();

  const newBlocks = createReadOnlyBlocks(contentState);
  const newContentState = contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });

  return EditorState.push(editorState, newContentState, 'change-block-data');
}

export function toContentState(text: string) {
  return text.startsWith('<') && text.endsWith('>')
    ? stateFromHTML(text)
    : convertFromRaw(JSON.parse(text));
}

export function toEditorState(text: string, decorator?: any) {
  return text
    ? EditorState.createWithContent(toContentState(text), decorator)
    : EditorState.createEmpty(decorator);
}

export function toReadOnlyEditorState(text: string, decorator?: any) {
  const editorState = toEditorState(text, decorator);
  return createReadOnlyEditorState(editorState);
}
