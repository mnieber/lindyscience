import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import {
  FormField,
  validateMoveUrl,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  FormFieldLabel,
  strToPickerValue,
  difficulties
} from 'utils/form_utils'
import {
  Editor, EditorState, RichUtils, convertFromRaw, convertToRaw
} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';


class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    const content = stateFromHTML(props.content);
    this.state = {editorState: EditorState.createWithContent(content)};
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

// MoveForm

export class MoveForm extends React.Component {
  constructor(props) {
    super(props);
    this.descriptionEditor = React.createRef();
    this.privateNotesEditor = React.createRef();
    this.difficultyPicker = React.createRef();
    this.tagsPicker = React.createRef();
  }

  _onCancel = e => {
    e.preventDefault();
    this.props.onCancel()
  }

  render() {
    const InnerForm = props => {
      const knownTags = this.props.knownTags.map(strToPickerValue);
      const isOwner = this.props.move.owner_id == 1 || !this.props.move.owner_id;

      const nameField =
        <FormField
          classNames="w-full"
          label='Name'
          formProps={props}
          fieldName='name'
          type='text'
          placeholder="Name"
          autoFocus={this.props.autoFocus}
        />

      const toPickerValue = val => {
        return {
          label: difficulties[val],
          value: val
        }
      }

      const difficultyPicker =
        <div className="moveForm__difficultyPicker z-20 mt-4">
          <ValuePicker
            zIndex={21}
            ref={this.difficultyPicker}
            label='Difficulty'
            defaultValue={toPickerValue(this.props.move.difficulty)}
            fieldName='difficulty'
            isMulti={false}
            options={[
              toPickerValue('beg'),
              toPickerValue('beg/int'),
              toPickerValue('int'),
              toPickerValue('int/adv'),
              toPickerValue('adv'),
            ]}
            placeholder="Difficulty"
          />
          {formFieldError(props, 'difficulty', ['formField__error'])}
        </div>

      const description =
        <div className="moveForm__description mt-4">
          <FormFieldLabel label='Description'/>
          <RichTextEditor
            ref={this.descriptionEditor}
            content={this.props.move.description}
          />
          {formFieldError(props, 'description', ['formField__error'])}
        </div>

      const privateNotes =
        <div className="moveForm__privateNotes mt-4">
          <FormFieldLabel label='Private notes'/>
          <RichTextEditor
            ref={this.privateNotesEditor}
            content={this.props.move.privateData.notes || ''}
          />
          {formFieldError(props, 'privateNotes', ['formField__error'])}
        </div>

      const defaultValue = this.props.move.tags.map(strToPickerValue);

      const tags =
        <div className="moveForm__tags mt-4">
          <ValuePicker
            zIndex={10}
            ref={this.tagsPicker}
            isCreatable={true}
            label='Tags'
            defaultValue={defaultValue}
            fieldName='tags'
            isMulti={true}
            options={knownTags}
            placeholder="Tags"
          />
          {formFieldError(props, 'tags', ['formField__error'], "error")}
        </div>

      return (
        <form className="moveForm w-full" onSubmit={props.handleSubmit}>
          <div className={"moveForm flexcol"}>
            {isOwner && nameField}
            {isOwner && difficultyPicker}
            {isOwner && description}
            {privateNotes}
            {isOwner && tags}
            <div className={"moveForm__buttonPanel flexrow mt-4"}>
              <button
                className="button button--wide ml-2"
                type="submit"
                disabled={props.isSubmitting}
              >
                save
              </button>
              <button
                className="button button--wide ml-2"
                onClick={this._onCancel}
              >
                cancel
              </button>
            </div>
          </div>
        </form>
      )
    }

    const EnhancedForm = withFormik({
      mapPropsToValues: () => ({
        name: this.props.move.name,
        difficulty: this.props.move.difficulty,
        tags: this.props.move.tags,
      }),

      validate: (values, props) => {
        // HACK: add values from non-input fields
        values.description = stateToHTML(
          this.descriptionEditor.current.state.editorState.getCurrentContent()
        );
        values.privateNotes = stateToHTML(
          this.privateNotesEditor.current.state.editorState.getCurrentContent()
        );
        values.difficulty = getValueFromPicker(this.difficultyPicker.current, "");
        values.tags = getValueFromPicker(this.tagsPicker.current, []);

        let errors = {};
        if (!values.name) {
          errors.name = 'This field is required';
        }
        if (!values.difficulty) {
          errors.difficulty = 'This field is required';
        }
        if (!values.tags) {
          errors.tags = 'This field is required';
        }
        return errors;
      },

      handleSubmit: (values, { setSubmitting }) => {
        this.props.onSubmit(this.props.move.id, values);
      },
      displayName: 'BasicForm', // helps with React DevTools
    })(InnerForm);

    return <EnhancedForm/>;
  }
}
