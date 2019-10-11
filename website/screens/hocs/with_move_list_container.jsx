// @flow

import * as React from "react";
import { compose } from "redux";

import type {
  DataContainerT,
  PayloadT,
} from "screens/containers/data_container";
import Ctr from "screens/containers/index";
import { actSetMoveListContainerPayload } from "screens/actions";
import { actInsertMoveListIds } from "profiles/actions";
import { getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";

import { apiSaveMoveListOrdering } from "move_lists/api";

import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";

// $FlowFixMe
export const withMoveListContainer = compose(
  Ctr.connect(state => ({
    moveLists: Ctr.fromStore.getMoveLists(state),
    moveListContainerPayload: Ctr.fromStore.getMoveListContainerPayload(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const { moveLists, moveListContainerPayload, ...passThroughProps } = props;

    function _setPayload(payload: ?PayloadT<MoveListT>) {
      props.dispatch(actSetMoveListContainerPayload(payload));
    }

    function _insertPayload(
      cancel: boolean,
      overridePayload: ?PayloadT<MoveListT>
    ) {
      const pl = overridePayload || moveListContainerPayload;
      if (!cancel) {
        const payLoadIds = pl.payload.map(x => x.id);
        const allMoveListIds = props.dispatch(
          actInsertMoveListIds(payLoadIds, pl.targetItemId, pl.isBefore)
        );
        apiSaveMoveListOrdering(allMoveListIds).catch(
          createErrorHandler("We could not update the move list")
        );
      }
      _setPayload(null);
    }

    const moveListContainer: DataContainerT<MoveListT> = {
      insertPayload: _insertPayload,
      preview: getPreview<MoveListT>(moveLists, moveListContainerPayload),
      payload: moveListContainerPayload,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent
        moveListContainer={moveListContainer}
        {...passThroughProps}
      />
    );
  }
);
