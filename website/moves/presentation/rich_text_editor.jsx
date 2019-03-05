import React from 'react'
import {
  Editor, EditorState, RichUtils, convertFromRaw, convertToRaw
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';


export class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    const content = stateFromHTML(props.content);
    this.state = {
      editorState: EditorState.createWithContent(content)
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    return (
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
    );
  }
}
