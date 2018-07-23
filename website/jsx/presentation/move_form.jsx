import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import {
  FormField, validateMoveUrl, ValuePicker, formFieldError, pickerValue, FormFieldLabel
} from 'jsx/utils/form_utils'
import {
  stripTags
} from 'jsx/utils/utils'
import {
  Editor, EditorState, RichUtils, convertFromRaw, convertToRaw
} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';


class DescriptionEditor extends React.Component {
  constructor(props) {
    super(props);
    const content = stateFromHTML(props.description);
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

export class MoveForm extends React.Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.difficultyPicker = React.createRef();
    this.tagsPicker = React.createRef();
  }

  _form = () => {
    const toPickerValue = value => ({value: value, label: value});

    const InnerForm = props => {

      const knownTags = [];
      this.props.knownTags.forEach(tag => {
        knownTags.push(toPickerValue(tag));
      });

      return (
        <form className="moveForm w-full" onSubmit={props.handleSubmit}>
          <div className={"flex flex-col"}>
            <FormField
              label='Name'
              classNames="w-full"
              formProps={props}
              fieldName='name'
              type='text'
              placeholder="Name"
            />
            <ValuePicker
              zIndex={20}
              ref={this.difficultyPicker}
              label='Difficulty'
              defaultValue={toPickerValue(this.props.move.difficulty)}
              fieldName='difficulty'
              isMulti={false}
              options={[
                toPickerValue('Beginner'),
                toPickerValue('Beginner Intermediate'),
                toPickerValue('Intermediate'),
                toPickerValue('Intermediate Advanced'),
                toPickerValue('Advanced'),
              ]}
              placeholder="Difficulty"
            />
            {formFieldError(props, 'difficulty', ['formField__error'])}

            <FormFieldLabel label='Description'/>
            <DescriptionEditor
              ref={this.editor}
              description={this.props.move.description}
            />
            {formFieldError(props, 'description', ['formField__error'])}

            <ValuePicker
              zIndex={10}
              ref={this.tagsPicker}
              isCreatable={true}
              label='Tags'
              defaultValue={this.props.move.tags.split(',').map(toPickerValue)}
              fieldName='tags'
              isMulti={true}
              options={knownTags}
              placeholder="Tags"
            />
            {formFieldError(props, 'tags', ['formField__error'])}

            <div className={"flex flex-row mt-4"}>
              <button
                className="button button--wide ml-2"
                type="submit"
                disabled={props.isSubmitting}
              >
                save
              </button>
              <button
                className="button button--wide ml-2"
                onClick={this.props.onCancel}
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
          this.editor.current.state.editorState.getCurrentContent()
        );
        values.difficulty = pickerValue(this.difficultyPicker.current, "");
        values.tags = pickerValue(this.tagsPicker.current, []).join(", ");

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
        if (!stripTags(values.description).trim()) {
          errors.description = 'This field is required';
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

  render() {
    return this._form();
  }
}
