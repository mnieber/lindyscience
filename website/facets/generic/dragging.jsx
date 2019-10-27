// @flow

import { type GetBvrT, behaviour_impl, listen, operation } from "facets/index";
import { action, observable } from "utils/mobx_wrapper";

export type InsertPositionT = {
  targetItemId: any,
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
    action("cancelDrag", function() {
      self.position = undefined;
    })
  );
}

export function initDragging(self: Dragging): Dragging {
  _handleCancel(self);
  return self;
}
