import React from 'react'
import classnames from 'classnames';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { FormField, validateVideoLinkUrl } from 'jsx/utils/form_utils'


class VideoLinkForm extends React.Component {
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

export class VideoLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: props.item.url == ''
    }
  }

  _renderView = () => {
    const voteCount = (
      <div className={
        classnames(
          'videolink__voteCount',
          {
            'videolink__voteCount--voted': this.props.vote != 0,
            'videolink__voteCount--notVoted': this.props.vote == 0,
          }
        )
      }>{this.props.item.voteCount}</div>
    );

    const upVote = (
      <div
        className={
          classnames(
            'videolink__upVoteBtn',
            {
            'videolink__upVoteBtn--voted': this.props.vote == 1,
            'videolink__upVoteBtn--notVoted': this.props.vote != 1,
            }
          )
        }
        onClick={() => {
          this.props.setVote(this.props.item.id, this.props.vote == 1 ? 0 : 1)
        }}
      />
    );

    const downVote = (
      <div
        className={
          classnames(
            'videolink__downVoteBtn',
            {
            'videolink__downVoteBtn--voted': this.props.vote == -1,
            'videolink__downVoteBtn--notVoted': this.props.vote != -1,
            }
          )
        }
        onClick={() => {
          this.props.setVote(this.props.item.id, this.props.vote == -1 ? 0 : -1)
        }}
      />
    );

    const link = (
      <a
        className='videolink__url'
        href={this.props.item.url}
        target='blank'
      >
        {this.props.item.title || this.props.item.url}
      </a>
    );

    const editBtn = (
      <div
        className="editVideoLinkBtn ml-2"
        onClick={() => this._setIsEditing(true)}
      >
      edit
      </div>
    );

    return (
      <div className='videolink'>
        {voteCount}
        {upVote}
        {downVote}
        {link}
        {editBtn}
      </div>
    );
  }

  _setIsEditing = flag => {this.setState({isEditing: flag})}

  _renderEdit = () => {
    const form = (
      <VideoLinkForm
        values={{
          url: this.props.item.url,
          title: this.props.item.title,
        }}
        onSubmit={values => {
          this.props.saveVideoLink(this.props.item.id, values);
          this._setIsEditing(false);
        }}
        onCancel={() => {
          this.props.cancelEditVideoLink(this.props.item.id);
          this._setIsEditing(false);
        }}
      />
    );

    return (
      <div className='videolink'>
        {form}
      </div>
    );
  }

  render() {
    if (this.state.isEditing) {
      return this._renderEdit();
    }
    else {
      return this._renderView();
    }
  }
}


export class VideoLinkList extends React.Component {
  render() {
    const items = this.props.items.map((item, idx) => {
      return (
        <VideoLink
          key={item.id}
          item={item}
          vote={this.props.getMoveVideoLinkVoteById(item.id)}
          setVote={this.props.setVote}
          saveVideoLink={this.props.saveVideoLink}
          cancelEditVideoLink={this.props.cancelEditVideoLink}
        />
      );
    })

    return <div>{items}</div>
  }
}
