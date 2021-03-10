import { computed, observable, action, makeObservable } from 'mobx';
import { createUUID } from 'src/utils/utils';

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

  constructor() {
    makeObservable(this);
    this.id = createUUID();
  }

  @action setWidth(x: number) {
    if (x !== this.width) {
      this.width = x;
    }
  }
  @action setFullVideoWidth(x: boolean) {
    this.fullVideoWidth = x;
  }
}
