// @flow

import {
  Insertion,
  type PayloadSourceT,
} from "screens/data_containers/bvrs/insertion";
import { createPatch } from "screens/data_containers/utils";

export const insertionPicksAPayloadsSource = ({
  payloadSources,
}: {
  payloadSources: Array<?PayloadSourceT>,
}) =>
  createPatch(Insertion, [null], container => ({
    get _sourcedPayload() {
      for (var payloadSource of payloadSources) {
        if (payloadSource) {
          const payload = payloadSource(container);
          if (payload) {
            return payload;
          }
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
