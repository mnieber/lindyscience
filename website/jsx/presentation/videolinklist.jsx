import React from 'react'

export class VideoLinkList extends React.Component {
  render() {
    const items = this.props.items.map((item, idx) => {
      return (
        <div className='videolink' key={idx}>
          <div className='videolink__nrVotes'>{item.nr_votes}</div>
          <div className='videolink__likeBtn'>+</div>
          <a className='videolink__url' href='{item.url}' target='blank'>{item.default_title}</a>
        </div>
      );
    })

    return <div>{items}</div>
  }
}
