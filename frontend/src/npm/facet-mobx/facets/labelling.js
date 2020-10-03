// @flow

// $FlowFixMe
import { observable } from 'mobx';

import { input, installHandlers, operation } from 'src/npm/facet';
import { type ClassMemberT } from 'src/npm/facet';
import { lookUp } from 'src/npm/facet-mobx/internal/utils';
import { mapDatas, relayData } from 'src/npm/facet-mobx';

export type IdsByLabelT = { [string]: Array<any> };
export type ItemsByLabelT = { [string]: Array<any> };
export type LabelValueT = { label: string, id: any, flag: boolean };

type saveIdsT = (label: string, ids: Array<any>) => any;

export class Labelling {
  @observable idsByLabel: IdsByLabelT = {};
  ids = (label: string) => this.idsByLabel[label] || [];

  @input itemsByLabel: ItemsByLabelT;

  @operation setLabel(labelValue: LabelValueT) {}

  static get = (ctr: any): Labelling => ctr.labelling;
}

const _handleSetLabel = (saveIds: saveIdsT) => (self: Labelling) => ({
  label,
  id,
  flag,
}: LabelValueT) => {
  self.idsByLabel[label] = self.idsByLabel[label] || [];
  if (flag && !self.idsByLabel[label].includes(id)) {
    self.idsByLabel[label].push(id);
    saveIds(label, self.idsByLabel[label]);
  }
  if (!flag && self.idsByLabel[label].includes(id)) {
    self.idsByLabel[label] = self.idsByLabel[label].filter((x) => x != id);
    saveIds(label, self.idsByLabel[label]);
  }
};

export const initLabelling = (
  self: Labelling,
  {
    saveIds,
  }: {
    saveIds: saveIdsT,
  }
): Labelling => {
  installHandlers({ setLabel: _handleSetLabel(saveIds) }, self);
  return self;
};

export const labellingActsOnItems = ([Collection, itemById]: ClassMemberT) => {
  return mapDatas(
    [
      [Collection, itemById],
      [Labelling, 'idsByLabel'],
    ],
    [Labelling, 'itemsByLabel'],
    (itemById, idsByLabel) =>
      Object.fromEntries(
        Object.entries(idsByLabel).map(([label, ids]) =>
          lookUp((ids: any), itemById)
        )
      )
  );
};

export const labellingReceivesIds = (
  [Collection, ids]: ClassMemberT,
  label: string,
  transform: ?Function
) =>
  relayData(
    [Collection, ids],
    [Labelling, 'idsByLabel'],
    transform,
    (ids, idsByLabel) => {
      idsByLabel[label] = ids;
    }
  );