// @flow

import { action, computed, observable } from 'src/utils/mobx_wrapper';
import type { TipByIdT, TipsByIdT } from 'src/tips/types';
import type { UUID } from 'src/kernel/types';
import { isNone, reduceMapToMap } from 'src/utils/utils';

export class TipsStore {
  @observable tipById: TipByIdT = {};

  @action addTips(tipById: TipByIdT) {
    this.tipById = {
      ...this.tipById,
      ...tipById,
    };
  }

  @action removeTips(tipIds: Array<UUID>) {
    this.tipById = Object.keys(this.tipById)
      .filter((x) => !tipIds.includes(x))
      .reduce((acc, id) => {
        acc[id] = this.tipById[id];
        return acc;
      }, {});
  }

  @action castVote(tipId: UUID, vote: number, prevVote: number) {
    const tip = this.tipById[tipId];
    if (tip) {
      this.tipById = {
        ...this.tipById,
        [tipId]: {
          ...tip,
          voteCount: tip.voteCount + (vote - prevVote),
        },
      };
    }
  }

  @computed get tipsByMoveId() {
    return reduceMapToMap<TipsByIdT>(this.tipById, (acc, tipId, tip) => {
      if (isNone(acc[tip.moveId])) {
        acc[tip.moveId] = [];
      }
      acc[tip.moveId].push(tip);
      // TODO:
      // acc[tip.moveId] = acc[tip.moveId]
      //   .sort((lhs, rhs) => rhs.initialVoteCount - lhs.initialVoteCount);
    });
  }
}