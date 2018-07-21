import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'
import { toastr } from 'react-redux-toastr'
import { VideoLinkList } from 'jsx/presentation/videolink';
import { querySetListToDict } from 'jsx/utils/utils'


class VideoLinksPanel extends React.Component {
  _vote = (id, vote) => {
    this.props.voteMoveVideoLink(id, vote);
    api.voteMoveVideoLink(id, vote)
    .catch(() => toastr.error('Oops!', 'We could not save your vote'));
  }

  _save = (id, values) => {
    values.move = this.props.move.id;
    const isNew = !this.props.getMoveVideoLinkById(id).url;
    this.props.patchMoveVideoLink(id, values);
    var response = isNew
      ? api.saveMoveVideoLink(values)
      : api.patchMoveVideoLink(id, values);

    response.catch(() => toastr.error('Oops!', 'We could not save the video link'));
  }

  _add = () => {
    this.props.addMoveVideoLinks(querySetListToDict([{
      id: uuidv4(),
      move: this.props.move.id,
      voteCount: 0,
      title: '',
      url: ''
    }]));
  }

  render() {
    const addVideoLinkBtn = (
      <div className={"button button--wide ml-2"} onClick={this._add}
      >
      Add
      </div>
    );

    return (
      <div className={"panel"}>
        <div className= {"flex flex-wrap mb-4"}>
          <h2>Video links</h2>
          {addVideoLinkBtn}
        </div>
        <VideoLinkList
          items={this.props.getVideoLinksByMoveId(this.props.move.id)}
          setVote={this._vote}
          saveVideoLink={this._save}
          cancelEditVideoLink={this.props.removeEmptyMoveVideoLinks}
          getMoveVideoLinkVoteById={this.props.getMoveVideoLinkVoteById}
        />
      </div>
    );
  }
};


VideoLinksPanel = connect(
  (state) => ({
    getVideoLinksByMoveId: x => fromStore.getVideoLinksByMoveId(state.linsci, x),
    getMoveVideoLinkById: id => fromStore.getMoveVideoLinkById(state.linsci, id),
    getMoveVideoLinkVoteById: id => fromStore.getMoveVideoLinkVoteById(state.linsci, id),
  }),
  actions
)(VideoLinksPanel)


export default VideoLinksPanel;
