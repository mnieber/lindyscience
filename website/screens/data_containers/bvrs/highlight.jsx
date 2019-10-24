// @flow

import {
  type GetBvrT,
  behaviour_impl,
  data,
  listen,
  operation,
} from "screens/data_containers/utils";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
export class Highlight {
  @observable id: any;
  @data item: any;

  // $FlowFixMe
  @operation highlightItem(id: any) {}

  static get: GetBvrT<Highlight>;
}

const _handleHighlight = (self: Highlight) => {
  listen(
    self,
    "highlightItem",
    action(function(id) {
      self.id = id;
    })
  );
};

export const createHighlight = (): Highlight => {
  const self = new Highlight();
  _handleHighlight(self);
  return self;
};
