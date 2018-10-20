import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types';


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
      const videoLinks = this.props.getVideoLinksByMoveId(move.id);
      const videoLinkDiv = videoLinks.length
        ? <a className='ml-2' href={videoLinks[0].url} target='blank'>VIDEO</a>
        : undefined;

      return (
        <div key={idx} className = {"moveList__item"}>
          <Link to={`/app/moves/${move.slug}`}>
            {move.name}
          </Link>
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
  moves: PropTypes.array.isRequired,
  moveTags: PropTypes.array.isRequired,
  saveMove: PropTypes.func.isRequired,
  selectedMoveId: PropTypes.string.isRequired,
}
