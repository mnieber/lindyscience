// @flow

import { Insertion, type PayloadSourceT } from "facet-mobx/facets/insertion";
import { createPatch } from "facet-mobx";
import { prop } from "rambda";
import { findMap } from "utils/rambda";

export const insertionPicksAPayloadsSource = ({
  payloadSources,
}: {
  payloadSources: Array<PayloadSourceT>,
}) =>
  createPatch(Insertion, [null], container => ({
    get _sourcedPayload() {
      return findMap(plSrc => plSrc(container), payloadSources);
    },
    get payload() {
      return prop("payload", this._sourcedPayload);
    },
    get position() {
      return prop("position", this._sourcedPayload);
    },
  }));

export const insertionUsesASinglePayload = createPatch(Insertion, [], () => ({
  payload: undefined,
  position: undefined,
}));
