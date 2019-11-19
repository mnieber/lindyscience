// @flow

import { extractTimePoints } from "video/utils";
import { computed, observable } from "utils/mobx_wrapper";
import { type GetFacet, facetClass, input } from "facet";
import type { MoveT } from "moves/types";

// $FlowFixMe
@facetClass
export class TimePoints {
  @input @observable textWithTimePoints: string;

  updateFrom(move: ?MoveT) {
    const description = move ? move.description : "";
    const privateNotes = move && move.privateData ? move.privateData.notes : "";
    const newText = description + privateNotes;
    if (this.textWithTimePoints != newText) this.textWithTimePoints = newText;
  }

  // $FlowFixMe
  @computed get timePoints() {
    return extractTimePoints(this.textWithTimePoints);
  }

  static get: GetFacet<TimePoints>;
}

export function initTimePoints(self: TimePoints): TimePoints {
  return self;
}
