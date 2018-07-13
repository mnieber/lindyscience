import React from 'react'
import classnames from 'classnames';


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

    const saveBtn = (
      <div
        className="editVideoLinkBtn ml-2"
        onClick={() => this.setState({isEditing: false})}
      >
      save
      </div>
    );

    const cancelBtn = (
      <div
        className="editVideoLinkBtn ml-2"
        onClick={() => this.setState({isEditing: false})}
      >
      cancel
      </div>
    );

    return (
      <div className='videolink'>
        {link}
        {title}
        {saveBtn}
        {cancelBtn}
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
