import React from 'react'
import classnames from 'classnames';
import { connect } from 'react-redux'
import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import { MoveList, MoveListHeader } from 'jsx/presentation/movelist';


class MovesPage extends React.Component {
  render() {
    return (
      <div>
        <MoveListHeader/>
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
