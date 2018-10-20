import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import uuidv4 from 'uuid/v4'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { deepCopy, querySetListToDict, slugify } from 'jsx/utils/utils'
import { MoveList, MoveListHeader } from 'jsx/presentation/movelist';


function _createNewMove() {
  return {
    id: uuidv4(),
    slug: 'new-move',
    name: 'New move',
    description: '',
    difficulty: '',
    tags: '',
    owner: 1, // TODO
    privateData: {},
  };
}


class MovesPage extends React.Component {
  _addNewMove = () => {
    const newMove = _createNewMove();
    this.setState({
      moves: [...this.state.moves, newMove],
      selectedMoveId: newMove.id,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      moves: []
    };
  }

  componentWillReceiveProps(props) {
    if (props) {
      this.setState({
        moves: deepCopy(props.moves),
        selectedMoveId: props.selectedMoveId,
      })
    };
  }

  _saveMove = (id, values) => {
    const isNew = !this.props.getMoveById(id);
    this.props.addMoves(querySetListToDict([values]));

    let response = isNew
      ? api.saveMove(values)
      : api.patchMove(id, values);
    response.catch(() => toastr.error('Oops!', 'We could not save the move'));
  }

  render() {
    return (
      <div>
        <MoveListHeader
          addNewMove={this._addNewMove}
        />
        <MoveList
          getVideoLinksByMoveId={this.props.getVideoLinksByMoveId}
          setSelectedMoveId={this.props.setSelectedMoveId}
          moves={this.state.moves}
          moveTags={this.props.moveTags}
          saveMove={(id, values) => this._saveMove(
            id,
            {...values, id: id, slug: slugify(values.name), owner: 1} // TODO
          )}
          selectedMoveId={this.state.selectedMoveId}
        />
      </div>
    )
  }
}

MovesPage = connect(
  (state) => ({
    getMoveById: x => fromStore.getMoveById(state.linsci, x),
    getVideoLinksByMoveId: x => fromStore.getVideoLinksByMoveId(state.linsci, x),
    moves: fromStore.getMoves(state.linsci),
    moveTags: fromStore.getMoveTags(state.linsci),
    selectedMoveId: fromStore.getSelectedMoveId(state.linsci),
  }),
  actions
)(MovesPage)

export default MovesPage;
