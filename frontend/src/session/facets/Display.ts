import { computed, observable, action, makeObservable } from 'mobx';

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

  constructor() {
    makeObservable(this);
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
