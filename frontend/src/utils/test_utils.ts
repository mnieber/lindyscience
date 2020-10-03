import redtape from 'redtape';
import sinon from 'sinon';

export const test = redtape({
  beforeEach: function (cb) {
    cb();
  },
  afterEach: function (cb) {
    sinon.restore();
    cb();
  },
  asserts: {
    calledOnceWith: function (stubFn, args, msg) {
      this.assert(
        stubFn.calledOnce,
        `${msg} (times called: ${stubFn.callCount})`
      );
      if (stubFn.firstCall) {
        this.deepEqual(stubFn.firstCall.args, args, `${msg} (arguments match)`);
      } else {
        this.deepEqual(stubFn.args, args, `${msg} (arguments match)`);
      }
    },
  },
});
