// @flow

import { Insertion, type PayloadSourceT } from "facet-mobx/facets/insertion";
import { createPatch } from "facet-mobx";
import { find } from "rambda";

export const insertionPicksAPayloadsSource = ({
  payloadSources,
}: {
  payloadSources: Array<PayloadSourceT>,
}) =>
  createPatch(Insertion, [null], container => ({
    get _sourcedPayload() {
      return find(payloadSource => payloadSource(container), payloadSources);
    },
    get payload() {
      return this._sourcedPayload ? this._sourcedPayload.payload : undefined;
    },
    get position() {
      return this._sourcedPayload ? this._sourcedPayload.position : undefined;
    },
  }));

export const insertionUsesASinglePayload = createPatch(Insertion, [], () => ({
  payload: undefined,
  position: undefined,
}));
