// @flow

import {
  type ClassMemberT,
  type GetFacet,
  facetClass,
  output,
  listen,
  mapDatas,
  operation,
} from "facet/index";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@facetClass
export class Highlight {
  @observable id: any;

  @output item: any;

  // $FlowFixMe
  @operation highlightItem(id: any) {}

  static get: GetFacet<Highlight>;
}

const _handleHighlight = (self: Highlight) => {
  listen(
    self,
    "highlightItem",
    action("highlightItem", function(id) {
      self.id = id;
    })
  );
};

export const initHighlight = (highlight: Highlight): Highlight => {
  _handleHighlight(highlight);
  return highlight;
};

export const highlightActsOnItems = ([Collection, itemById]: ClassMemberT) =>
  mapDatas(
    [[Collection, itemById], [Highlight, "id"]],
    [Highlight, "item"],
    (itemById, id) => itemById[id]
  );
