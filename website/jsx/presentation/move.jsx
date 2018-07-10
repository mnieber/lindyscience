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


class VideoLinkList extends React.Component {
  render() {
    const items = this.props.items.map((item, idx) => {
      return (
        <div className='videolink' key={idx}>
          <div className={
            classnames(
              'videolink__nrVotes',
              {
                'videolink__nrVotes--liked': item.isLikedByCurrentUser,
                'videolink__nrVotes--notLiked': !item.isLikedByCurrentUser,
              }
            )
          }>{item.nrVotes}</div>
          <div
            className={
              classnames(
                'videolink__likeBtn',
                {
                  'videolink__likeBtn--liked': item.isLikedByCurrentUser,
                  'videolink__likeBtn--notLiked': !item.isLikedByCurrentUser,
                }
              )
            }
            onClick={() => this.props.toggleLike(item.id)}
          />
          <a className='videolink__url' href='{item.url}' target='blank'>{item.defaultTitle}</a>
        </div>
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
          toggleLike={this.props.toggleLikeVideoLink}
        />
      </div>
    )
  }
}
