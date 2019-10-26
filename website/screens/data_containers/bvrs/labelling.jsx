// @flow

import {
  type ClassMemberT,
  type GetBvrT,
  behaviour_impl,
  data,
  listen,
  mapDatas,
  operation,
  relayData,
} from "screens/data_containers/utils";
import { lookUp } from "utils/utils";
import { action, observable } from "utils/mobx_wrapper";

export type IdsByLabelT = { [string]: Array<any> };
export type ItemsByLabelT = { [string]: Array<any> };

// $FlowFixMe
@behaviour_impl
export class Labelling {
  @observable idsByLabel: IdsByLabelT = {};
  ids = (label: string) => this.idsByLabel[label] || [];

  @data itemsByLabel: ItemsByLabelT;
  @data saveIds: (label: string, ids: Array<any>) => any;

  // $FlowFixMe
  @operation setLabel(label: string, id: any, flag: boolean) {}

  static get: GetBvrT<Labelling>;
}

const _handleLabelling = (self: Labelling) => {
  listen(
    self,
    "setLabel",
    action(function(label: string, id: any, flag: boolean) {
      self.idsByLabel[label] = self.idsByLabel[label] || [];
      if (flag && !self.idsByLabel[label].includes(id)) {
        self.idsByLabel[label].push(id);
        self.saveIds(label, self.idsByLabel[label]);
      }
      if (!flag && self.idsByLabel[label].includes(id)) {
        self.idsByLabel[label] = self.idsByLabel[label].filter(x => x != id);
        self.saveIds(label, self.idsByLabel[label]);
      }
    })
  );
};

export const initLabelling = (
  self: Labelling,
  {
    saveIds,
  }: {
    saveIds: (label: string, ids: Array<any>) => any,
  }
): Labelling => {
  self.saveIds = saveIds;
  _handleLabelling(self);
  return self;
};

export const labellingActsOnItems = ([Collection, itemById]: ClassMemberT) =>
  mapDatas(
    [[Collection, itemById], [Labelling, "idsByLabel"]],
    [Labelling, "itemsByLabel"],
    (itemById, idsByLabel) =>
      // $FlowFixMe
      Object.fromEntries(
        Object.entries(idsByLabel).map(([label, ids]) =>
          lookUp((ids: any), itemById)
        )
      )
  );

export const labellingReceivesIds = (
  [Collection, ids]: ClassMemberT,
  label: string,
  transform: ?Function
) =>
  relayData(
    [Collection, ids],
    [Labelling, "idsByLabel"],
    transform,
    (ids, idsByLabel) => {
      idsByLabel[label] = ids;
    }
  );
