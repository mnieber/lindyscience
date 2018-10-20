import React from 'react'
import { VoteCount } from 'jsx/presentation/vote_count'
import { VideoLinkForm } from 'jsx/presentation/video_link_form'
import { videoLinkType } from 'jsx/types'
import { PropTypes } from 'prop-types';
import { voteType } from 'jsx/types'


export class VideoLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: props.item.url == ''
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

VideoLink.propTypes = {
  item: videoLinkType.isRequired,
  vote: voteType.isRequired,
  voteCount: PropTypes.number.isRequired,
  setVote: PropTypes.func.isRequired,
  saveVideoLink: PropTypes.func.isRequired,
  cancelEditVideoLink: PropTypes.func.isRequired,
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

VideoLinkList.propTypes = {
  items: PropTypes.arrayOf(videoLinkType).isRequired,
  getMoveVideoLinkVoteById: PropTypes.func.isRequired,
  setVote: PropTypes.func.isRequired,
  saveVideoLink: PropTypes.func.isRequired,
  cancelEditVideoLink: PropTypes.func.isRequired,
}
