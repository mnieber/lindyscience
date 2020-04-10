// @flow

// $FlowFixMe
import { action, observable } from "mobx";

import {
  type ClassMemberT,
  type GetFacet,
  facetClass,
  output,
  data,
  listen,
  operation,
} from "facet";
import { mapDatas } from "facet-mobx";

// $FlowFixMe
@facetClass
export class Highlight {
  @data @observable id: any;

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
    [
      [Collection, itemById],
      [Highlight, "id"],
    ],
    [Highlight, "item"],
    (itemById, id) => itemById[id]
  );
