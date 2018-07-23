import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { MoveList, MoveListHeader } from 'jsx/presentation/movelist';


class MovesPage extends React.Component {
  _addNewMove = () => {
    browserHistory.push(`/app/moves/new`);
  }

  render() {
    return (
      <div>
        <MoveListHeader addNewMove={this._addNewMove}/>
        <MoveList moves={this.props.moves}/>
      </div>
    )
  }
}

MovesPage = connect(
  (state) => ({
    moves: fromStore.getMoves(state.linsci),
  }),
  actions
)(MovesPage)

export default MovesPage;
