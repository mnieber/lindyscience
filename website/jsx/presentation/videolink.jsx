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
      mapPropsToValues: () => ({ url: this.props.values.url }),
      validationSchema: yup.object().shape({
        url: yup.string()
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
      isEditing: false
    }
  }

  _renderView = () => {
    const nrVotes = (
      <div className={
        classnames(
          'videolink__nrVotes',
          {
            'videolink__nrVotes--voted': this.props.vote != 0,
            'videolink__nrVotes--notVoted': this.props.vote == 0,
          }
        )
      }>{this.props.item.nrVotes}</div>
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
        {this.props.item.defaultTitle}
      </a>
    );

    const editBtn = (
      <div
        className="editVideoLinkBtn ml-2"
        onClick={() => this.setState({isEditing: true})}
      >
      edit
      </div>
    );

    return (
      <div className='videolink'>
        {nrVotes}
        {upVote}
        {downVote}
        {link}
        {editBtn}
      </div>
    );
  }

  _renderEdit = () => {
    const link = (
      <input
        type='text'
        defaultValue={this.props.item.url}
        placeholder={'Link'}
      >
      </input>
    );

    const title = (
      <input
        type='text'
        defaultValue={this.props.item.defaultTitle}
        placeholder={'Description'}
      >
      </input>
    );

    const form = (
      <VideoLinkForm
        values={{
          url: this.props.item.url,
        }}
        onSubmit={() => this.setState({isEditing: false})}
        onCancel={() => this.setState({isEditing: false})}
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
          item={item}
          vote={this.props.getMoveVideoLinkVoteById(item.id)}
          key={idx} setVote={this.props.setVote}
        />
      );
    })

    return <div>{items}</div>
  }
}
