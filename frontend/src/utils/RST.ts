import { action } from 'mobx';

const RESET = 'RESET';
const UPDATING = 'UPDATING';
const ERRORED = 'ERRORED';
const UPDATED = 'UPDATED';
const LOADING = 'LOADING';

export type ResetRST = {
  type: typeof RESET;
};

export const resetRS = (): ResetRST => ({ type: RESET });

export const isResetRS = <UpdatingT>(rs: RST<UpdatingT>): rs is ResetRST =>
  rs.type === RESET;

export type UpdatingRST<UpdatingT> = {
  type: typeof UPDATING;
  updating_state: UpdatingT;
};

export const updatingRS = <UpdatingT>(
  updating_state: UpdatingT
): UpdatingRST<UpdatingT> => ({
  type: UPDATING,
  updating_state,
});

export const isUpdatingRS = <UpdatingT>(
  rs: RST<UpdatingT>
): rs is UpdatingRST<UpdatingT> => rs.type === UPDATING;

export type ErroredRST = {
  type: typeof ERRORED;
  message: string;
};

export const erroredRS = (message: string): ErroredRST => ({
  type: ERRORED,
  message,
});

export const isErroredRS = <UpdatingT>(rs: RST<UpdatingT>): rs is ErroredRST =>
  rs.type === ERRORED;

export type UpdatedRST = {
  type: typeof UPDATED;
};

export const updatedRS = (): UpdatedRST => ({
  type: UPDATED,
});

export const isUpdatedRS = <UpdatingT>(rs: RST<UpdatingT>): rs is UpdatedRST =>
  rs.type === UPDATED;

export type LoadingT = {
  type: typeof LOADING;
};

export const loadingRS = (): UpdatingRST<LoadingT> =>
  updatingRS({
    type: LOADING,
  });

export type RST<UpdatingT = LoadingT> =
  | ResetRST
  | UpdatingRST<UpdatingT>
  | ErroredRST
  | UpdatedRST;

export const updateRes = action(
  (
    rsMap: { [k: string]: any },
    id: string,
    load: Function,
    then: Function,
    getErrorMsg?: Function
  ) => {
    const rs = rsMap[id];
    if (rs && isUpdatedRS(rs)) {
      return Promise.resolve(undefined);
    }
    rsMap[id] = loadingRS();
    return load()
      .then(
        action((result: any) => {
          then(result);
          rsMap[id] = updatedRS();
        })
      )
      .catch(
        action((e: any) => {
          rsMap[id] = erroredRS(
            getErrorMsg ? getErrorMsg(e) : `Could not load ${id}`
          );
        })
      );
  }
);
