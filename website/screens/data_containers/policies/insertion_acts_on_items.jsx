// @flow

import { Insertion } from "screens/data_containers/bvrs/insertion";
import { type ClassMemberT, mapData } from "screens/data_containers/utils";

export const insertionActsOnItems = ([Collection, items]: ClassMemberT) =>
  mapData([Collection, items], [Insertion, "inputs"]);
