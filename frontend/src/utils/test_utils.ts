import redtape from 'redtape';
import sinon from 'sinon';

export const test = redtape({
  beforeEach: function (cb: Function) {
    cb();
  },
  afterEach: function (cb: Function) {
    sinon.restore();
    cb();
  },
  asserts: {
    calledOnceWith: function (stubFn: any, args: any, msg: string) {
      // @ts-ignore
      this.assert(
        stubFn.calledOnce,
        `${msg} (times called: ${stubFn.callCount})`
      );
      if (stubFn.firstCall) {
        // @ts-ignore
        this.deepEqual(stubFn.firstCall.args, args, `${msg} (arguments match)`);
      } else {
        // @ts-ignore
        this.deepEqual(stubFn.args, args, `${msg} (arguments match)`);
      }
    },
  },
});
