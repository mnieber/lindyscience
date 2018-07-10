import React from 'react'
import classnames from 'classnames';
import { Link } from 'react-router';
import {Placeholder} from 'jsx/presentation/placeholder'


export class MoveHeader extends React.Component {
  render() {
    return (
      <div className = {"move__header"}>
        <Link to='/app/moves'>All moves</Link>
        <a href={`/moves/${this.props.move.name}/edit`}>Edit move</a>
      </div>
    )
  }
}


class Tags extends React.Component {
  render() {
    const tagNames = this.props.tagNamesStr.split(',');
    const items = tagNames.map((tagName, idx) => {
      return <div key={idx} className="moveTag">{tagName}</div>;
    });

    return (
      <div className = {"move__tags"}>
        {items}
      </div>
    )
  }
}


class VideoLink extends React.Component {
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



class VideoLinkList extends React.Component {
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

export class Move extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.move.name}</h1>
        <Tags tagNamesStr={this.props.move.tags}/>
        <Placeholder
          loadPlaceholder={this.props.loadDescription}
        />
        <VideoLinkList
          items={this.props.videoLinks}
          setVote={this.props.voteVideoLink}
          getMoveVideoLinkVoteById={this.props.getMoveVideoLinkVoteById}
        />
      </div>
    )
  }
}
