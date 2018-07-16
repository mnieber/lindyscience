import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import { connect } from 'react-redux'
import { MoveHeader, Move } from 'jsx/presentation/move'
import { toastr } from 'react-redux-toastr'


class MovePage extends React.Component {
  voteVideoLink = (id, vote) => {
    this.props.voteMoveVideoLink(id, vote);
    api.voteMoveVideoLink(id, vote)
    .catch(() => toastr.error('Oops!', 'We could not save your vote'));
  }

  saveVideoLink = (id, values) => {
    values.defaultTitle = values.title || values.url;
    this.props.patchMoveVideoLink(id, values);
    api.patchMoveVideoLink(id, values)
    .catch(() => toastr.error('Oops!', 'We could not save the video link'));
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
          videoLinks={this.props.getVideoLinksByMoveId(this.props.move.id)}
          voteVideoLink={this.voteVideoLink}
          saveVideoLink={this.saveVideoLink}
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
