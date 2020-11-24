import { computed, observable } from 'src/utils/mobx_wrapper';
import { MovePrivateDataT, MoveT } from 'src/moves/types';
import { extractTimePoints } from 'src/video/utils';
import { input } from 'facility';

export class TimePoints {
  @input @observable textWithTimePoints: string | undefined;

  updateFrom(move?: MoveT, movePrivateData?: MovePrivateDataT) {
    const description = move ? move.description : '';
    const privateNotes = movePrivateData ? movePrivateData.notes : '';
    const newText = description + privateNotes;
    if (this.textWithTimePoints !== newText) this.textWithTimePoints = newText;
  }

  @computed get timePoints() {
    return extractTimePoints(this.textWithTimePoints ?? '');
  }

  static get = (ctr: any): TimePoints => ctr.timepoints;
}

export function initTimePoints(self: TimePoints): TimePoints {
  return self;
}
