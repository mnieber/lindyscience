import React from 'react'
import { connect } from 'react-redux'
import jquery from 'jquery';
import { browserHistory } from 'react-router'
import {querySetListToDict} from 'jsx/utils/utils'

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
      api.loadVotes(),
    )
    .done((moves, moveVideoLinks, votes) => {
      this.props.setMoves(querySetListToDict(moves));
      this.props.addMoveVideoLinks(querySetListToDict(moveVideoLinks));
      this.props.setVotes(votes);
      this.props.setIOStatus("ok");
    })
    .catch(() => {
      this.props.setIOStatus("error");
    });
  }

  render() {
    return (
      <div>
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
