import React from 'react'
import VideoLinksPanel from 'jsx/containers/videolinkspanel'
import TipsPanel from 'jsx/containers/tipspanel'
import { Move } from 'jsx/presentation/move'
import { moveType } from 'jsx/types'
import { PropTypes } from 'prop-types';


export class MoveListHeader extends React.Component {
  render() {

    const newMoveBtn = (
      <div className={"button button--wide ml-2"} onClick={this.props.addNewMove}>
      New move
      </div>
    );

    return (
      <div className= {"flex flex-wrap"}>
        <h1>Moves</h1>
        {newMoveBtn}
      </div>
    )
  }
}

MoveListHeader.propTypes = {
  addNewMove: PropTypes.func.isRequired
}

export class MoveList extends React.Component {
  render() {
    const items = this.props.moves.map((move, idx) => {
      if (move.id === this.props.selectedMoveId) {
        const videoLinksPanel = <VideoLinksPanel move={move}/>;
        const tipsPanel = <TipsPanel move={move}/>;

        return (
          <Move
            key={idx}
            move={move}
            videoLinksPanel={videoLinksPanel}
            tipsPanel={tipsPanel}
            saveMove={this.props.saveMove}
            moveTags={this.props.moveTags}
          />
        )
      }
      const videoLinks = this.props.getVideoLinksByMoveId(move.id);
      const videoLinkDiv = videoLinks.length
        ? <a className='ml-2' href={videoLinks[0].url} target='blank'>VIDEO</a>
        : undefined;

      return (
        <div
          key={idx}
          className = {"moveList__item"}
          onClick={() => this.props.setSelectedMoveId(move.id)}
        >
          {move.name}
          {videoLinkDiv}
        </div>
      )
    })

    return (
      <div className = {"flex flex-col"}>
        {items}
      </div>
    )
  }
}

MoveList.propTypes = {
  getVideoLinksByMoveId: PropTypes.func.isRequired,
  moves: PropTypes.arrayOf(moveType).isRequired,
  moveTags: PropTypes.array.isRequired,
  saveMove: PropTypes.func.isRequired,
  selectedMoveId: PropTypes.string,
  setSelectedMoveId: PropTypes.func.isRequired,
}
