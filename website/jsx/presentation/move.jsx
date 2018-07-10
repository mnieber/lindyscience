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
              'videolink__nrVotes--liked': this.props.item.isLikedByCurrentUser,
              'videolink__nrVotes--notLiked': !this.props.item.isLikedByCurrentUser,
            }
          )
        }>{this.props.item.nrVotes}</div>
        <div
          className={
            classnames(
              'videolink__likeBtn',
              {
                'videolink__likeBtn--liked': this.props.item.isLikedByCurrentUser,
                'videolink__likeBtn--notLiked': !this.props.item.isLikedByCurrentUser,
              }
            )
          }
          onClick={() => this.props.toggleLike(this.props.item.id)}
        />
        <a
          className='videolink__url'
          href='{this.props.item.url}'
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
        <VideoLink item={item} key={idx} toggleLike={this.props.toggleLike}/>
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
