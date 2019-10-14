// @flow

import { Insertion } from "screens/data_containers/bvrs/insertion";
import type { AdapterT } from "screens/data_containers/utils";
import { reaction } from "utils/mobx_wrapper";

export const insertionCreatesThePreview = ({
  preview: [Collection, previewMember],
}: AdapterT) => (ctr: any) => {
  reaction(
    () => Insertion.get(ctr).preview,
    preview => {
      Collection.get(ctr)[previewMember] = preview;
    }
  );
};
