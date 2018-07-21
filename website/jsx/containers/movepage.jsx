import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import uuidv4 from 'uuid/v4'
import { connect } from 'react-redux'
import { MoveHeader, Move } from 'jsx/presentation/move'
import { querySetListToDict } from 'jsx/utils/utils'
import { toastr } from 'react-redux-toastr'


class MovePage extends React.Component {
  voteVideoLink = (id, vote) => {
    this.props.voteMoveVideoLink(id, vote);
    api.voteMoveVideoLink(id, vote)
    .catch(() => toastr.error('Oops!', 'We could not save your vote'));
  }

  saveVideoLink = (id, values) => {
    values.move = this.props.move.id;
    const isNewMove = !this.props.getMoveVideoLinkById(id).url;
    this.props.patchMoveVideoLink(id, values);
    var response = null;
    if (isNewMove) {
      response = api.saveMoveVideoLink(values);
    }
    else {
      response = api.patchMoveVideoLink(id, values);
    }
    response.catch(() => toastr.error('Oops!', 'We could not save the video link'));
  }

  addVideoLink = () => {
    this.props.addMoveVideoLinks(querySetListToDict([{
      id: uuidv4(),
      move: this.props.move.id,
      title: '',
      url: ''
    }]));
  }

  cancelEditVideoLink = () => {
    this.props.removeEmptyMoveVideoLinks();
  }

  render() {
    if (!this.props.move) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <MoveHeader move={this.props.move}/>
        <Move
          move={this.props.move}
          loadDescription={() => api.loadMoveDescription(this.props.move.name)}
          loadPrivateNotes={() => api.loadMovePrivateNotes(this.props.move.id)}
          videoLinks={this.props.getVideoLinksByMoveId(this.props.move.id)}
          voteVideoLink={this.voteVideoLink}
          saveVideoLink={this.saveVideoLink}
          addVideoLink={this.addVideoLink}
          cancelEditVideoLink={this.cancelEditVideoLink}
          getMoveVideoLinkVoteById={this.props.getMoveVideoLinkVoteById}
        />
      </div>
    )
  }
}

MovePage = connect(
  (state) => ({
    getMoveByName: x => fromStore.getMoveByName(state.linsci, x),
    getVideoLinksByMoveId: x => fromStore.getVideoLinksByMoveId(state.linsci, x),
    getMoveVideoLinkById: id => fromStore.getMoveVideoLinkById(state.linsci, id),
    getMoveVideoLinkVoteById: id => fromStore.getMoveVideoLinkVoteById(state.linsci, id),
  }),
  actions,
  (state, actions, {children, params}) => { return({
      ...state,
      ...actions,
      children: children,
      move: state.getMoveByName(params.name),
  })}
)(MovePage)

export default MovePage;
