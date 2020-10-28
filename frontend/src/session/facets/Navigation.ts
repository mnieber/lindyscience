import { action, observable, runInAction } from 'src/utils/mobx_wrapper';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { data, operation } from 'facet';
import { installHandlers } from 'facet-mobx';

export type DataRequestT = {
  moveSlugid?: string;
  moveListUrl?: string;
  profileUrl?: string;
};

const createDataRequestMap = (createValue: Function) => ({
  moveSlugid: createValue(),
  moveListUrl: createValue(),
  profileUrl: createValue(),
});

export class Navigation {
  @observable history: any;
  @observable locationMemo?: string;
  // TODO: move data loading stuff out
  @observable dataRequest: DataRequestT = {};
  @observable loadedData = createDataRequestMap(() => []);
  @observable notFoundData = createDataRequestMap(() => []);
  @observable @data pathname = '';
  @observable @data params = {};

  @operation requestData(dataRequest: DataRequestT) {}
  @operation navigateToMove(move: MoveT) {}
  @operation navigateToMoveList(moveList: MoveListT) {}
  @operation storeLocation() {}
  @operation restoreLocation() {}

  @action setParams = (params: any) => {
    this.params = params;
  };

  static get = (ctr: any): Navigation => ctr.navigation;
}

function _handleRequestData(this: Navigation, dataRequest: DataRequestT) {
  this.dataRequest = dataRequest;
}

function _handleStoreLocation(this: Navigation) {
  this.locationMemo = window.location.pathname;
}

function _handleRestoreLocation(this: Navigation) {
  this.history.push(this.locationMemo);
}

const _setHistory = (self: Navigation, history: any) => {
  runInAction(() => {
    self.pathname = window.location.pathname;
    self.history = history;
    self.history.listen(
      action((location: any, action: any) => {
        self.pathname = location.pathname;
      })
    );
  });
};

interface PropsT {
  history: any;
  navigateToMoveList: (moveList: MoveListT) => void;
}

export function initNavigation(self: Navigation, props: PropsT): Navigation {
  _setHistory(self, props.history);
  installHandlers(
    {
      requestData: _handleRequestData,
      storeLocation: _handleStoreLocation,
      restoreLocation: _handleRestoreLocation,
      navigateToMoveList: props.navigateToMoveList,
    },
    self
  );
  return self;
}

export const ensureSelected = (selection: Selection, id: any) => {
  if (!selection.ids.includes(id)) {
    selection.selectItem({ itemId: id });
  }
};

export const getStatus = (self: Navigation) => {
  const entries = Object.entries(self.dataRequest);
  return entries.reduce(
    (acc, [resourceName, url]) => {
      return {
        ...acc,
        [resourceName]: {
          hasLoaded: (self.loadedData as any)[resourceName].includes(url),
          notFound: (self.notFoundData as any)[resourceName].includes(url),
        },
      };
    },
    createDataRequestMap(() => ({ hasLoaded: false, notFound: false }))
  );
};
