import React from 'react'
import {VideoLinkList} from 'jsx/presentation/videolinklist'
import {Placeholder} from 'jsx/presentation/placeholder'
import * as fromStore from 'jsx/reducers'
import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import { connect } from 'react-redux'

class VideoLinks extends React.Component {
  componentWillMount() {
    const moveVideoLinks = {};
    this.props.items.forEach(item => {
      moveVideoLinks[item.id] = item;
    })
    this.props.setMoveVideoLinks(moveVideoLinks);
  }

  toggleLike = (id) => {
    const isLiked = this.props.getMoveVideoLink(id).isLikedByCurrentUser;
    api.setLikeMoveVideoLink(id, !isLiked);
    this.props.toggleLikeMoveVideoLink(id);
  }

  render() {
    return ([
      <Placeholder
        key='1'
        loadPlaceholder={() => api.loadMoveDescription(this.props.moveName)}
      />,
      <VideoLinkList
        key='2'
        items={this.props.moveVideoLinks}
        toggleLike={this.toggleLike}
      />
    ])
  }
}

VideoLinks = connect(
  (state) => ({
    moveVideoLinks: fromStore.getMoveVideoLinks(state.linsci),
    getMoveVideoLink: id => fromStore.getMoveVideoLink(state.linsci, id),
  }),
  actions
)(VideoLinks)

export default VideoLinks;
