// @flow

import { Insertion, type PayloadSourceT } from "facet-mobx/facets/insertion";
import { createPatch } from "facet-mobx";

export const insertionPicksAPayloadsSource = ({
  payloadSources,
}: {
  payloadSources: Array<PayloadSourceT>,
}) =>
  createPatch(Insertion, [null], container => ({
    get _sourcedPayload() {
      for (var payloadSource of payloadSources) {
        const payload = payloadSource(container);
        if (payload) {
          return payload;
        }
      }
      return undefined;
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
