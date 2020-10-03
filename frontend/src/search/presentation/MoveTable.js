// @flow

import React from 'react';
import ReactTable from 'react-table';

import type { MoveSearchResultT } from 'src/search/types';
import { RouterLink } from 'src/utils/RouterLink';

type PropsT = {
  moveSearchResults: Array<MoveSearchResultT>,
};

function _moveListUrl(moveSearchResult: MoveSearchResultT) {
  return (
    '/lists/' +
    moveSearchResult.sourceMoveList.ownerUsername +
    '/' +
    moveSearchResult.sourceMoveList.slug
  );
}

function _moveListName(moveSearchResult: MoveSearchResultT) {
  return (
    moveSearchResult.sourceMoveList.ownerUsername +
    '/' +
    moveSearchResult.sourceMoveList.name
  );
}

function _moveUrl(moveSearchResult: MoveSearchResultT) {
  return _moveListUrl(moveSearchResult) + '/' + moveSearchResult.slug;
}

export function MoveTable(props: PropsT) {
  const _getTrProps = (state, rowInfo, column, instance) => {
    const moveListId = rowInfo ? rowInfo.row.id : '';
    const className = '';

    return {
      id: 'row-' + moveListId,
      onClick: (e, handleOriginal) => {},
      className: className,
    };
  };

  const _columns = () => {
    const columns = [
      {
        accessor: 'name',
        Header: (props) => <span className="">Name</span>,
        Cell: (props) => {
          return (
            <RouterLink to={_moveUrl(props.original)}>
              {props.original.name}
            </RouterLink>
          );
        },
        style: {
          whiteSpace: 'normal',
          minWidth: 400,
        },
      },
      {
        accessor: 'moveList',
        Header: (props) => <span className="">Move List</span>,
        Cell: (props) => {
          return (
            <RouterLink to={_moveListUrl(props.original)}>
              {_moveListName(props.original)}
            </RouterLink>
          );
        },
        style: {
          whiteSpace: 'normal',
          minWidth: 400,
        },
      },
    ];

    return columns;
  };

  return (
    <div className="moveTable">
      <ReactTable
        data={props.moveSearchResults}
        columns={_columns()}
        getTrProps={_getTrProps}
        noDataText=""
      />
    </div>
  );
}