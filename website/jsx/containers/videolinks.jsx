import React from 'react'
import {VideoLinkList} from 'jsx/presentation/videolinklist'
import * as fromStore from 'jsx/reducers'
import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import { connect } from 'react-redux'

class VideoLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      innerHtml: {__html: ''}
    }
  }

  componentWillMount() {
    api.loadMoveDescription(
      this.props.moveName
    )
    .then(innerHtml => this.setState({innerHtml: {__html: innerHtml}}));

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
      <div key='1' dangerouslySetInnerHTML={this.state.innerHtml}/>,
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
