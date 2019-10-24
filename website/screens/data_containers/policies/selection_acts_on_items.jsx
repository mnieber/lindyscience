// @flow

import { type ClassMemberT, mapDatas } from "screens/data_containers/utils";
import { Selection } from "screens/data_containers/bvrs/selection";
import { lookUp } from "utils/utils";

export const selectionActsOnItems = ([Collection, itemById]: ClassMemberT) =>
  mapDatas(
    [[Collection, itemById], [Selection, "ids"]],
    [Selection, "items"],
    (itemById, ids) => lookUp(ids, itemById)
  );
