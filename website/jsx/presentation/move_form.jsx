import React from 'react'
import classnames from 'classnames';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { FormField, validateMoveUrl } from 'jsx/utils/form_utils'
import {Editor, EditorState} from 'draft-js';

// TODO move to app.jsx
import 'draft-js/dist/Draft.css'


class DescriptionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    return (
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

export class MoveForm extends React.Component {
  _form = () => {
    const InnerForm = props => {

      return (
        <form className="moveForm w-full" onSubmit={props.handleSubmit}>
          <div className={"flex flex-wrap"}>
            <FormField
              classNames="w-64"
              formProps={props}
              fieldName='name'
              type='text'
              placeholder="Name"
            />
            <h2>Description</h2>
            <DescriptionEditor/>
            <button
              className="editMoveBtn ml-2"
              type="submit"
              disabled={props.isSubmitting}
            >
              save
            </button>
            <button
              className="editMoveBtn ml-2"
              onClick={this.props.onCancel}
            >
              cancel
            </button>
          </div>
        </form>
      )
    }

    const EnhancedForm = withFormik({
      mapPropsToValues: () => ({
        name: this.props.values.name,
      }),
      validationSchema: yup.object().shape({
        name: yup.string()
          .required('This field is required'),
      }),
      validate: (values, props) => {
        let errors = {};
        return errors;
      },
      handleSubmit: (values, { setSubmitting }) => {
        this.props.onSubmit(values);
      },
      displayName: 'BasicForm', // helps with React DevTools
    })(InnerForm);

    return <EnhancedForm/>;
  }

  render() {
    return this._form();
  }
}
