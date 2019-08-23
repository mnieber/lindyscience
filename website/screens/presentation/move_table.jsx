// @flow

import React from "react";
import { Link } from "@reach/router";

// $FlowFixMe
import ReactTable from "react-table";

import { getObjectValues } from "utils/utils";
import classnames from "classnames";

import type { MoveSearchResultT } from "screens/types";
import type { UUID } from "app/types";

type MoveTablePropsT = {
  moves: Array<MoveSearchResultT>,
};

function _moveListUrl(moveSearchResult: MoveSearchResultT) {
  return (
    "/app/lists/" +
    moveSearchResult.sourceMoveList.ownerUsername +
    "/" +
    moveSearchResult.sourceMoveList.slug
  );
}

function _moveListName(moveSearchResult: MoveSearchResultT) {
  return (
    moveSearchResult.sourceMoveList.ownerUsername +
    "/" +
    moveSearchResult.sourceMoveList.name
  );
}

function _moveUrl(moveSearchResult: MoveSearchResultT) {
  return _moveListUrl(moveSearchResult) + "/" + moveSearchResult.slug;
}

export function MoveTable(props: MoveTablePropsT) {
  const _getTrProps = (state, rowInfo, column, instance) => {
    const moveListId = rowInfo ? rowInfo.row.id : "";
    const className = "";

    return {
      id: "row-" + moveListId,
      onClick: (e, handleOriginal) => {},
      className: className,
    };
  };

  const _columns = () => {
    const columns = [
      {
        accessor: "name",
        Header: props => <span className="">Name</span>,
        Cell: props => {
          return (
            <Link to={_moveUrl(props.original)}>{props.original.name}</Link>
          );
        },
        style: {
          whiteSpace: "normal",
          minWidth: 400,
        },
      },
      {
        accessor: "moveList",
        Header: props => <span className="">Move List</span>,
        Cell: props => {
          return (
            <Link to={_moveListUrl(props.original)}>
              {_moveListName(props.original)}
            </Link>
          );
        },
        style: {
          whiteSpace: "normal",
          minWidth: 400,
        },
      },
    ];

    return columns;
  };

  return (
    <div className="moveTable">
      <ReactTable
        data={props.moves}
        columns={_columns()}
        getTrProps={_getTrProps}
        noDataText=""
      />
    </div>
  );
}
