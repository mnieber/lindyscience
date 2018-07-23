import React from 'react'
import { Link } from 'react-router'


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

export class MoveList extends React.Component {
  render() {
    const items = this.props.moves.map((move, idx) => {
      return (
        <div key={idx} className = {"moveList__item"}>
          <Link to={`/app/moves/${move.slug}`}>
            {move.name}
          </Link>
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
