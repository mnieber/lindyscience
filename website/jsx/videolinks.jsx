import React from 'react'
import ReactDOM from 'react-dom'
import { getStore } from 'jsx/store'
import { Provider } from 'react-redux';


class VideoLinkList extends React.Component {
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

export function render(rootElement, data_str) {
  ReactDOM.render(
    <Provider store={getStore()}>
      <VideoLinkList items={JSON.parse(data_str)}/>
    </Provider>
    , rootElement
  );
}