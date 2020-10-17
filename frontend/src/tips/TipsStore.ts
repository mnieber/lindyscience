import { keys } from 'lodash/fp';

import { VoteT } from 'src/votes/types';
import { action, computed, observable } from 'src/utils/mobx_wrapper';
import { TipT, TipByIdT } from 'src/tips/types';
import { UUID } from 'src/kernel/types';
import * as _ from 'lodash/fp';

export class TipsStore {
  @observable tipById: TipByIdT = {};

  @action addTips(tipById: TipByIdT) {
    this.tipById = {
      ...this.tipById,
      ...tipById,
    };
  }

  @action removeTips(tipIds: Array<UUID>) {
    this.tipById = keys(this.tipById)
      .filter((x) => !tipIds.includes(x))
      .reduce((acc: any, id: any) => {
        acc[id] = this.tipById[id];
        return acc;
      }, {});
  }

  @action castVote(tipId: UUID, vote: VoteT, prevVote: VoteT) {
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
    return _.flow(
      _.always(this.tipById),
      _.toPairs,
      _.reduce((acc: any, [tipId, tip]: [UUID, TipT]) => {
        return _.flow(
          _.always(acc),
          _.set(tip.moveId, acc[tip.moveId] ?? []),
          _.update(tip.moveId, (tips) => [...tips, tip])
        )();
      }, {}),
      _.mapValues(_.sortBy((x: TipT) => -1 * x.initialVoteCount))
    )();
  }
}
