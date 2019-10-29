// @flow

// $FlowFixMe
import { action, observable } from "mobx";

import { type GetFacet, facetClass, listen, operation } from "facet";

export type InsertPositionT = {
  targetItemId: any,
  isBefore: boolean,
};

export type PayloadT = {
  showPreview: boolean,
  data: any,
};

// $FlowFixMe
@facetClass
export class Dragging {
  @observable position: ?InsertPositionT;

  // $FlowFixMe
  @operation drop() {}
  // $FlowFixMe
  @operation cancel() {}

  static get: GetFacet<Dragging>;
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
