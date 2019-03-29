// @flow

import React from "react";
import { Link } from "@reach/router";

// $FlowFixMe
import ReactTable from "react-table";

import { getObjectValues } from "utils/utils";
import { makeMoveListUrl } from "moves/utils";
import classnames from "classnames";

import type { MoveListT } from "moves/types";
import type { UUID } from "app/types";

const LoadingComponent = ({ className, loading, loadingText, ...rest }) => (
  <div
    className={classnames("-loading", { "-active": loading }, className)}
    {...rest}
  >
    <div className="-loading-inner">{loadingText}</div>
  </div>
);

type MoveListTablePropsT = {
  moveLists: Array<MoveListT>,
};

export function MoveListTable(props: MoveListTablePropsT) {
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
        Header: props => <span className="number">Name</span>,
        Cell: props => {
          return (
            <Link to={"/app/lists/" + makeMoveListUrl(props.original)}>
              {props.original.name}
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
