// @flow

import { input } from 'src/facet';
import type { MovePrivateDataT, MoveT } from 'src/moves/types';
import { extractTimePoints } from 'src/video/utils';
import { computed, observable } from 'src/utils/mobx_wrapper';

export class TimePoints {
  @input @observable textWithTimePoints: string;

  updateFrom(move: ?MoveT, movePrivateData: ?MovePrivateDataT) {
    const description = move ? move.description : '';
    const privateNotes = movePrivateData ? movePrivateData.notes : '';
    const newText = description + privateNotes;
    if (this.textWithTimePoints != newText) this.textWithTimePoints = newText;
  }

  @computed get timePoints() {
    return extractTimePoints(this.textWithTimePoints);
  }

  static get = (ctr: any): TimePoints => ctr.timepoints;
}

export function initTimePoints(self: TimePoints): TimePoints {
  return self;
}
