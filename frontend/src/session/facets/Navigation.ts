import { action, observable, runInAction } from 'src/utils/mobx_wrapper';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { data, installHandlers, operation } from 'src/npm/facet';
import { Selection } from 'src/npm/facet-mobx/facets/selection';

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

const _handleRequestData = (self: Navigation) => (
  dataRequest: DataRequestT
) => {
  self.dataRequest = dataRequest;
};

const _handleStoreLocation = (self: Navigation) => () => {
  self.locationMemo = window.location.pathname;
};

const _handleRestoreLocation = (self: Navigation) => () => {
  self.history.push(self.locationMemo);
};

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

export function initNavigation(self: Navigation, history: any): Navigation {
  _setHistory(self, history);
  installHandlers(
    {
      requestData: _handleRequestData,
      storeLocation: _handleStoreLocation,
      restoreLocation: _handleRestoreLocation,
    },
    self
  );
  return self;
}

export const ensureSelected = (selection: Selection, id: any) => {
  if (!selection.ids.includes(id)) {
    selection.selectItem({
      itemId: id,
      isShift: false,
      isCtrl: false,
    });
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
