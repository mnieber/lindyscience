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
        <Link key={idx} to={`/app/moves/${move.name}`}>
          {move.name}
        </Link>
      )
    })

    return items
  }
}
