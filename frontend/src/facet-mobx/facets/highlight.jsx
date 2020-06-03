// @flow

// $FlowFixMe
import { observable } from 'mobx';

import { data, installHandlers, operation, output } from 'src/facet';
import { type ClassMemberT } from 'facet';
import { mapDatas } from 'src/facet-mobx';

export class Highlight {
  @data @observable id: any;

  @output item: any;

  @operation highlightItem(id: any) {}

  static get = (ctr: any): Highlight => ctr.highlight;
}

const _handleHighlight = (self: Highlight) => (id) => {
  self.id = id;
};

export const initHighlight = (self: Highlight): Highlight => {
  installHandlers(
    {
      highlightItem: _handleHighlight,
    },
    self
  );
  return self;
};

export const highlightActsOnItems = ([Collection, itemById]: ClassMemberT) =>
  mapDatas(
    [
      [Collection, itemById],
      [Highlight, 'id'],
    ],
    [Highlight, 'item'],
    (itemById, id) => itemById[id]
  );
