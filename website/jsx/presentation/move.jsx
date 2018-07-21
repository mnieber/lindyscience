import React from 'react'
import classnames from 'classnames';
import { Link } from 'react-router';
import {Placeholder} from 'jsx/presentation/placeholder'


export class MoveHeader extends React.Component {
  render() {
    return (
      <div className = {"move__header"}>
        <Link to='/app/moves'>All moves</Link>
      </div>
    )
  }
}


class Tags extends React.Component {
  render() {
    const tagNames = this.props.tagNamesStr.split(',');
    const items = tagNames.map((tagName, idx) => {
      return <div key={idx} className="moveTag">{tagName}</div>;
    });

    return (
      <div className = {"move__tags"}>
        {items}
      </div>
    )
  }
}


export class Move extends React.Component {
  render() {
    const editMoveBtn = (
      <div className={"button button--wide ml-2"} onClick={() => {
        window.location=`/moves/${this.props.move.name}/edit`
      }}
      >
      Edit move
      </div>
    );

    const nameDiv = (
      <div className= {"flex flex-wrap"}>
        <h1>{this.props.move.name}</h1>
        {editMoveBtn}
      </div>
    )

    return (
      <div>
        {nameDiv}
        <Tags tagNamesStr={this.props.move.tags}/>
        <div className={"panel"}>
        <h2>Description</h2>
        <Placeholder
          loadPlaceholder={this.props.loadDescription}
        />
        </div>
        <div className={"panel"}>
        <h2>Private notes</h2>
        <Placeholder
          loadPlaceholder={this.props.loadPrivateNotes}
        />
        </div>
        {this.props.tipsPanel}
        {this.props.videoLinksPanel}
      </div>
    )
  }
}


