import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import TipsPanel from 'jsx/containers/tipspanel'
import uuidv4 from 'uuid/v4'
import VideoLinksPanel from 'jsx/containers/videolinkspanel'
import { connect } from 'react-redux'
import { MoveHeader, Move } from 'jsx/presentation/move'
import { querySetListToDict, slugify } from 'jsx/utils/utils'
import { toastr } from 'react-redux-toastr'


function _createNewMove() {
  return {
    id: uuidv4(),
    temp_slug: '',
    name: '',
    description: '',
    difficulty: '',
    tags: '',
    privateData: {},
  };
}

class MovePage extends React.Component {

  _saveMove = (id, values) => {
    const isNew = !this.props.getMoveById(id);
    values.id = id;
    values.temp_slug = slugify(values.name);
    let response = undefined;
    this.props.addMoves(querySetListToDict([values]));
    if (isNew) {
      response = api.saveMove(values);
    }
    else {
      response = api.patchMove(id, values);
    }
    response.catch(() => toastr.error('Oops!', 'We could not save the move'));
  }

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
          videoLinksPanel={videoLinksPanel}
          tipsPanel={tipsPanel}
          saveMove={this._saveMove}
          moveTags={this.props.moveTags}
        />
      </div>
    )
  }
}

MovePage = connect(
  (state) => ({
    getMoveBySlug: x => fromStore.getMoveBySlug(state.linsci, x),
    getMoveById: x => fromStore.getMoveById(state.linsci, x),
    moveTags: fromStore.getMoveTags(state.linsci)
  }),
  actions,
  (state, actions, {children, params}) => { return({
      ...state,
      ...actions,
      children: children,
      move: (
        params.slug == 'new'
          ? _createNewMove()
          : state.getMoveBySlug(params.slug)
      ),
  })}
)(MovePage)

export default MovePage;
