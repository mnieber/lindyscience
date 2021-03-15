import React from 'react';
import ReactTable from 'react-table';
import classnames from 'classnames';

import { MoveListT } from 'src/movelists/types';
import { RouterLink } from 'src/utils/RouterLink';
import { makeMoveListUrl } from 'src/app/utils';

type LoadingComponentPropsT = {
  className: any;
  loading: boolean;
  loadingText: string;
};

const LoadingComponent: React.FC<LoadingComponentPropsT> = ({
  className,
  loading,
  loadingText,
  ...rest
}) => (
  <div
    className={classnames('-loading', { '-active': loading }, className)}
    {...rest}
  >
    <div className="-loading-inner">{loadingText}</div>
  </div>
);

type PropsT = {
  moveLists: Array<MoveListT>;
};

export function MoveListTable(props: PropsT) {
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
        Header: () => <span className="number">Name</span>,
        Cell: (props: any) => {
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
