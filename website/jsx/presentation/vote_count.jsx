import React from 'react'
import classnames from 'classnames';


export class VoteCount extends React.Component {
  render() {
    const voteCount = (
      <div className={
        classnames(
          'voteCount',
          {
            'voteCount--voted': this.props.vote != 0,
            'voteCount--notVoted': this.props.vote == 0,
          }
        )
      }>{this.props.count}</div>
    );

    const upVote = (
      <div
        className={
          classnames(
            'upVoteBtn',
            {
            'upVoteBtn--voted': this.props.vote == 1,
            'upVoteBtn--notVoted': this.props.vote != 1,
            }
          )
        }
        onClick={() => {
          this.props.setVote(this.props.vote == 1 ? 0 : 1)
        }}
      />
    );

    const downVote = (
      <div
        className={
          classnames(
            'downVoteBtn',
            {
            'downVoteBtn--voted': this.props.vote == -1,
            'downVoteBtn--notVoted': this.props.vote != -1,
            }
          )
        }
        onClick={() => {
          this.props.setVote(this.props.vote == -1 ? 0 : -1)
        }}
      />
    );

    return (
      <div className='voteCountPanel'>
        {voteCount}
        {upVote}
        {downVote}
      </div>
    );
  }
}
