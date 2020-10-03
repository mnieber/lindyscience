// $FlowFixMe
import { observable } from 'mobx';

import { installHandlers, operation } from 'src/npm/facet';

export type InsertPositionT = {
  targetItemId: any;
  isBefore: boolean;
};

export type PayloadT = {
  showPreview: boolean;
  data: any;
};

export class Dragging {
  @observable position?: InsertPositionT;

  @operation drop() {}
  @operation cancel() {}

  static get = (ctr: any): Dragging => ctr.dragging;
}

const _handleCancel = (self: Dragging) => () => {
  self.position = undefined;
};

export function initDragging(self: Dragging): Dragging {
  installHandlers({ cancel: _handleCancel }, self);
  return self;
}
