// @flow

import { observable } from 'src/utils/mobx_wrapper';

export class Display {
  @observable videoPanelWidth: number;
  @observable videoWidth: number;
  @observable rootDivId: string;

  static get = (ctr: any): Display => ctr.display;
}

export function initDisplay(self: Display, rootDivId: string): Display {
  self.rootDivId = rootDivId;
  return self;
}
