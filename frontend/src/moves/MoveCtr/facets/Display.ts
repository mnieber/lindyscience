import { observable } from 'src/utils/mobx_wrapper';

export class Display {
  @observable videoPanelWidth: number | undefined;
  @observable videoWidth: number | undefined;
  @observable rootDivId: string | undefined;

  static get = (ctr: any): Display => ctr.display;
}

export function initDisplay(self: Display, rootDivId: string): Display {
  self.rootDivId = rootDivId;
  return self;
}
