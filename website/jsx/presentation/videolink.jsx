import React from 'react'
import classnames from 'classnames';


export class VideoLink extends React.Component {
  render() {
    return (
      <div className='videolink'>
        <div className={
          classnames(
            'videolink__nrVotes',
            {
              'videolink__nrVotes--voted': this.props.vote != 0,
              'videolink__nrVotes--notVoted': this.props.vote == 0,
            }
          )
        }>{this.props.item.nrVotes}</div>
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
        <a
          className='videolink__url'
          href={this.props.item.url}
          target='blank'
        >
          {this.props.item.defaultTitle}
        </a>
      </div>
    );
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
