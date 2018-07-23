import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import { FormField, validateVideoLinkUrl } from 'jsx/utils/form_utils'


export class VideoLinkForm extends React.Component {
  _form = () => {
    const InnerForm = props => {

      return (
        <form className="videoLinkForm w-full" onSubmit={props.handleSubmit}>
          <div className={"flex flex-wrap"}>
            <FormField
              classNames="w-64"
              formProps={props}
              fieldName='url'
              type='text'
              placeholder="Link"
            />
            <FormField
              classNames="w-64"
              formProps={props}
              fieldName='title'
              type='text'
              placeholder="Title"
            />
            <button
              className="editVideoLinkBtn ml-2"
              type="submit"
              disabled={props.isSubmitting}
            >
              save
            </button>
            <button
              className="editVideoLinkBtn ml-2"
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
        url: this.props.values.url,
        title: this.props.values.title,
      }),
      validationSchema: yup.object().shape({
        url: yup.string()
          .required('This field is required'),
        title: yup.string()
          .required('This field is required'),
      }),
      validate: (values, props) => {
        let errors = {};
        const urlError = validateVideoLinkUrl(values.url);
        if (urlError) {
          errors['url'] = urlError;
        }
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
