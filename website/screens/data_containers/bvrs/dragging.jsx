// @flow

import {
  type GetBvrT,
  behaviour_impl,
  listen,
  operation,
} from "screens/data_containers/utils";
import type { UUID } from "kernel/types";
import { action, observable } from "utils/mobx_wrapper";

export type InsertPositionT = {
  targetItemId: UUID,
  isBefore: boolean,
};

export type PayloadT = {
  showPreview: boolean,
  data: any,
};

// $FlowFixMe
@behaviour_impl
export class Dragging {
  @observable position: ?InsertPositionT;

  // $FlowFixMe
  @operation drop() {}
  // $FlowFixMe
  @operation cancel() {}

  static get: GetBvrT<Dragging>;
}

function _handleCancel(self: Dragging) {
  listen(
    self,
    "cancel",
    action(function() {
      self.position = undefined;
    })
  );
}

export function createDragging() {
  const self = new Dragging();
  _handleCancel(self);
  return self;
}
