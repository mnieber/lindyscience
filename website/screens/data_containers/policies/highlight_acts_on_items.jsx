// @flow

import { type ClassMemberT, mapDatas } from "screens/data_containers/utils";
import { Highlight } from "screens/data_containers/bvrs/highlight";

export const highlightActsOnItems = ([Collection, itemById]: ClassMemberT) =>
  mapDatas(
    [[Collection, itemById], [Highlight, "id"]],
    [Highlight, "item"],
    (itemById, id) => itemById[id]
  );
