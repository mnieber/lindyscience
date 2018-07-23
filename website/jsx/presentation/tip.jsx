import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import { FormField, validateTipUrl } from 'jsx/utils/form_utils'
import { VoteCount } from 'jsx/presentation/vote_count'


class TipForm extends React.Component {
  _form = () => {
    const InnerForm = props => {

      return (
        <form className="tipForm w-full" onSubmit={props.handleSubmit}>
          <div className={"flex flex-wrap"}>
            <FormField
              classNames="w-64"
              formProps={props}
              fieldName='text'
              type='text'
              placeholder="Text"
            />
            <button
              className="editTipBtn ml-2"
              type="submit"
              disabled={props.isSubmitting}
            >
              save
            </button>
            <button
              className="editTipBtn ml-2"
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
        text: this.props.values.text,
      }),
      validationSchema: yup.object().shape({
        text: yup.string()
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

export class Tip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: props.item.text == ''
    }
  }

  _renderView = () => {
    const voteCount = (
      <VoteCount
        vote={this.props.vote}
        count={this.props.item.voteCount}
        setVote={value => this.props.setVote(this.props.item.id, value)}
      />
    )

    const text = (
      <div
        className='tip__text'
      >
        {this.props.item.text}
      </div>
    );

    const editBtn = (
      <div
        className="editTipBtn ml-2"
        onClick={() => this._setIsEditing(true)}
      >
      edit
      </div>
    );

    return (
      <div className='tip'>
        {voteCount}
        {text}
        {editBtn}
      </div>
    );
  }

  _setIsEditing = flag => {this.setState({isEditing: flag})}

  _renderEdit = () => {
    const form = (
      <TipForm
        values={{
          text: this.props.item.text,
        }}
        onSubmit={values => {
          this.props.saveTip(this.props.item.id, values);
          this._setIsEditing(false);
        }}
        onCancel={() => {
          this.props.cancelEditTip(this.props.item.id);
          this._setIsEditing(false);
        }}
      />
    );

    return (
      <div className='tip'>
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


export class TipList extends React.Component {
  render() {
    const items = this.props.items.map((item, idx) => {
      return (
        <Tip
          key={item.id}
          item={item}
          vote={this.props.getMoveTipVoteById(item.id)}
          setVote={this.props.setVote}
          saveTip={this.props.saveTip}
          cancelEditTip={this.props.cancelEditTip}
        />
      );
    })

    return <div>{items}</div>
  }
}
