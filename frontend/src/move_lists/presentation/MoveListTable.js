// @flow

import React from 'react';
import ReactTable from 'react-table';
import classnames from 'classnames';

import type { MoveListT } from 'src/move_lists/types';
import { RouterLink } from 'src/utils/RouterLink';
import { makeMoveListUrl } from 'src/app/utils';

const LoadingComponent = ({ className, loading, loadingText, ...rest }) => (
  <div
    className={classnames('-loading', { '-active': loading }, className)}
    {...rest}
  >
    <div className="-loading-inner">{loadingText}</div>
  </div>
);

type PropsT = {
  moveLists: Array<MoveListT>,
};

export function MoveListTable(props: PropsT) {
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
        Header: (props) => <span className="number">Name</span>,
        Cell: (props) => {
          return (
            <RouterLink to={'/lists/' + makeMoveListUrl(props.original)}>
              {props.original.name}
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
    <div className="moveListTable">
      <ReactTable
        data={props.moveLists}
        columns={_columns()}
        // showPagination={false}
        getTrProps={_getTrProps}
        noDataText="This user has not created any move lists yet"
        // defaultPageSize={30}
        LoadingComponent={LoadingComponent}
      />
    </div>
  );
}