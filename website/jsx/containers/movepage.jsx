import React from 'react'
import { MoveHeader, Move } from 'jsx/presentation/move'
import * as fromStore from 'jsx/reducers'
import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import { connect } from 'react-redux'


class MovePage extends React.Component {
  toggleLike = (id) => {
    const isLiked = this.props.getMoveVideoLinkById(id).isLikedByCurrentUser;
    api.setLikeMoveVideoLink(id, !isLiked);
    this.props.toggleLikeMoveVideoLink(id);
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
          toggleLikeVideoLink={this.toggleLike}
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
