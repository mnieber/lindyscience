import jquery from 'jquery';
import React from 'react'
import { connect } from 'react-redux'
import { querySetListToDict, createToastr } from 'jsx/utils/utils'

import * as actions from 'jsx/actions'
import * as fromStore from 'jsx/reducers'
import * as api from 'jsx/api'


class AppFrame extends React.Component {
  componentWillMount() {
    this.loadData();
  }

  shouldComponentUpdate() {
    return this.props.ioStatus !== 'loading';
  }

  loadData = () => {
    this.props.setIOStatus("loading");
    jquery.when(
      api.loadMoves(),
      api.loadMoveVideoLinks(),
      api.loadMoveTips(),
      api.loadVotes(),
      api.loadMovePrivateDatas(),
    )
    .done((movesAndTags, moveVideoLinks, tips, votes, movePrivateDatas) => {
      this.props.addMoves(querySetListToDict(movesAndTags.moves));
      this.props.addMoveTags(movesAndTags.tags);
      this.props.addMoveVideoLinks(querySetListToDict(moveVideoLinks));
      this.props.addMoveTips(querySetListToDict(tips));
      this.props.setVotes(votes);
      this.props.setMovePrivateDatas(
        querySetListToDict(movePrivateDatas, 'move_id')
      );
      this.props.setIOStatus("ok");
    })
    .catch(() => {
      this.props.setIOStatus("error");
    });
  }

  render() {
    return (
      <div>
        {createToastr()}
        {this.props.children}
      </div>
    );
  }
};

AppFrame = connect(
  (state) => ({
    ioStatus: fromStore.getIOStatus(state.linsci),
  }),
  actions
)(AppFrame)

export default AppFrame;
