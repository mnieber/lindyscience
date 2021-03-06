import { observable } from 'mobx';

export class Display {
  @observable videoPanelWidth: number | undefined;
  @observable videoWidth: number | undefined;
  @observable rootDivId: string | undefined;
}

export function initDisplay(self: Display, rootDivId: string): Display {
  self.rootDivId = rootDivId;
  return self;
}
