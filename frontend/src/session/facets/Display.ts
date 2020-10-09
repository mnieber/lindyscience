import { computed, observable, runInAction } from 'src/utils/mobx_wrapper';
import { createUUID } from 'src/utils/utils';
import { operation } from 'facet';

export class Display {
  @observable width?: number;
  @observable fullVideoWidth: boolean = false;
  @computed get maxVideoWidth() {
    return this.fullVideoWidth ? 1200 : 800;
  }
  @computed get small() {
    return !!this.width && this.width < this.smallBreakPoint;
  }

  @observable smallBreakPoint: number = 1200;
  @observable id: string = createUUID();

  @operation setWidth(x: number) {
    if (x !== this.width) {
      runInAction(() => {
        this.width = x;
      });
    }
  }
  @operation setFullVideoWidth(x: boolean) {
    runInAction(() => {
      this.fullVideoWidth = x;
    });
  }

  static get = (ctr: any): Display => ctr.display;
}

export function initDisplay(self: Display): Display {
  self.id = createUUID();
  return self;
}
