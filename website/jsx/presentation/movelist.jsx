import React from 'react'
import classnames from 'classnames';
import { Link } from 'react-router'


export class MoveListHeader extends React.Component {
  render() {
    return (
      <h1>Moves</h1>
    )
  }
}

export class MoveList extends React.Component {
  render() {
    const items = this.props.moves.map((move, idx) => {
      return (
        <div key={idx} className = {"moveList__item"}>
          <Link to={`/app/moves/${move.name}`}>
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
