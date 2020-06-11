// @flow

import { findMap } from 'src/npm/facet-mobx/internal/utils';
import {
  Insertion,
  type PayloadSourceT,
} from 'src/npm/facet-mobx/facets/insertion';
import { createPatch } from 'src/npm/facet-mobx';

export const insertionPicksAPayloadsSource = ({
  payloadSources,
}: {
  payloadSources: Array<PayloadSourceT>,
}) =>
  createPatch(Insertion, [null], (container) => ({
    get _sourcedPayload() {
      return findMap((plSrc) => plSrc(container), payloadSources);
    },
    get payload() {
      return this._sourcedPayload?.payload;
    },
    get position() {
      return this._sourcedPayload?.position;
    },
  }));

export const insertionUsesASinglePayload = createPatch(Insertion, [], () => ({
  payload: undefined,
  position: undefined,
}));
