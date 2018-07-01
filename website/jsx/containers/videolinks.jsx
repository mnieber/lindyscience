import React from 'react'
import {VideoLinkList} from 'jsx/presentation/videolinklist'
import * as fromStore from 'jsx/reducers'
import * as actions from 'jsx/actions'
import { connect } from 'react-redux'

class VideoLinks extends React.Component {
  componentWillMount() {
    this.props.setMoveVideoLinks(this.props.items);
  }

  render() {
    return (
      <VideoLinkList
        items={this.props.moveVideoLinks}
      />
    )
  }
}

VideoLinks = connect(
  (state) => ({
    moveVideoLinks: fromStore.getMoveVideoLinks(state.linsci),
  }),
  actions
)(VideoLinks)

export default VideoLinks;
