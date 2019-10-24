// @flow

import { type ClassMemberT, mapData } from "screens/data_containers/utils";
import { Filtering } from "screens/data_containers/bvrs/filtering";

export const filteringActsOnItems = ([Collection, items]: ClassMemberT) =>
  mapData([Collection, items], [Filtering, "inputItems"]);
