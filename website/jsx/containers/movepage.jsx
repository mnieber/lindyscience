import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import { connect } from 'react-redux'
import { MoveHeader, Move } from 'jsx/presentation/move'
import VideoLinksPanel from 'jsx/containers/videolinkspanel'
import TipsPanel from 'jsx/containers/tipspanel'


class MovePage extends React.Component {

  render() {
    if (!this.props.move) {
      return <div>Loading...</div>;
    }

    const videoLinksPanel = <VideoLinksPanel move={this.props.move}/>;
    const tipsPanel = <TipsPanel move={this.props.move}/>;

    return (
      <div>
        <MoveHeader move={this.props.move}/>
        <Move
          move={this.props.move}
          loadDescription={() => api.loadMoveDescription(this.props.move.name)}
          loadPrivateNotes={() => api.loadMovePrivateNotes(this.props.move.id)}
          videoLinksPanel={videoLinksPanel}
          tipsPanel={tipsPanel}
        />
      </div>
    )
  }
}

MovePage = connect(
  (state) => ({
    getMoveByName: x => fromStore.getMoveByName(state.linsci, x),
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
