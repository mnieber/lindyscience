import * as actions from 'jsx/actions'
import * as api from 'jsx/api'
import * as fromStore from 'jsx/reducers'
import React from 'react'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'
import { TipList } from 'jsx/presentation/tip';
import { toastr } from 'react-redux-toastr'
import { querySetListToDict } from 'jsx/utils/utils'


class TipsPanel extends React.Component {
  _vote = (id, vote) => {
    this.props.voteMoveTip(id, vote);
    api.voteMoveTip(id, vote)
    .catch(() => toastr.error('Oops!', 'We could not save your vote'));
  }

  _save = (id, values) => {
    values.move = this.props.move.id;
    const isNew = !this.props.getMoveTipById(id).text;
    this.props.patchMoveTip(id, values);
    var response = isNew
      ? api.saveMoveTip(values)
      : api.patchMoveTip(id, values);

    response.catch(() => toastr.error('Oops!', 'We could not save the tip'));
  }

  _add = () => {
    this.props.addMoveTips(querySetListToDict([{
      id: uuidv4(),
      move: this.props.move.id,
      text: '',
      voteCount: 0,
      title: '',
      url: ''
    }]));
  }

  render() {
    const addTipBtn = (
      <div className={"button button--wide ml-2"} onClick={this._add}
      >
      Add
      </div>
    );

    return (
      <div className={"panel"}>
        <div className= {"flex flex-wrap mb-4"}>
          <h2>Tips</h2>
          {addTipBtn}
        </div>
        <TipList
          items={this.props.getTipsByMoveId(this.props.move.id)}
          setVote={this._vote}
          saveTip={this._save}
          cancelEditTip={this.props.removeEmptyMoveTips}
          getMoveTipVoteById={this.props.getMoveTipVoteById}
        />
      </div>
    );
  }
};


TipsPanel = connect(
  (state) => ({
    getTipsByMoveId: x => fromStore.getTipsByMoveId(state.linsci, x),
    getMoveTipById: id => fromStore.getMoveTipById(state.linsci, id),
    getMoveTipVoteById: id => fromStore.getMoveTipVoteById(state.linsci, id),
  }),
  actions
)(TipsPanel)


export default TipsPanel;
