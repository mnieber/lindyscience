import React from 'react'
import classnames from 'classnames';

export class VideoLinkList extends React.Component {
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
