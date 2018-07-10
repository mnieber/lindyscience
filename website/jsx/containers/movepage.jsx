import React from 'react'
import { MoveHeader, Move } from 'jsx/presentation/move'
import * as fromStore from 'jsx/reducers'
import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import { connect } from 'react-redux'


class MovePage extends React.Component {
  voteVideoLink = (id, vote) => {
    api.voteMoveVideoLink(id, vote);
    this.props.voteMoveVideoLink(id, vote);
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
