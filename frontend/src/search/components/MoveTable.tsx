import React from 'react';
import ReactTable from 'react-table';

import { MoveSearchResultT } from 'src/search/types';
import { RouterLink } from 'src/utils/components/RouterLink';

type PropsT = {
  moveSearchResults: Array<MoveSearchResultT>;
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
  const _getTrProps = (
    state: any,
    rowInfo: any,
    column: any,
    instance: any
  ) => {
    const moveListId = rowInfo ? rowInfo.row.id : '';
    const className = '';

    return {
      id: 'row-' + moveListId,
      onClick: () => {},
      className: className,
    };
  };

  const _columns = () => {
    const columns = [
      {
        accessor: 'name',
        Header: (props: any) => <span className="">Name</span>,
        Cell: (props: any) => {
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
        Header: (props: any) => <span className="">Move List</span>,
        Cell: (props: any) => {
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
