import { apiLoadKnownMoveListTags, apiLoadKnownMoveTags } from 'src/tags/api';
import { TagMapT, TagT } from 'src/tags/types';
import { makeObservable, action, observable, computed } from 'mobx';
import { addTags } from 'src/tags/utils';
import { keys } from 'lodash/fp';

export class TagsStore {
  @observable moveTagsMap: TagMapT = {};
  @observable moveListTagsMap: TagMapT = {};

  constructor() {
    makeObservable(this);
  }

  loadKnownMoveTags() {
    apiLoadKnownMoveTags().then(
      action((tags: TagT[]) => {
        this.moveTagsMap = addTags([tags], this.moveTagsMap);
      })
    );
  }

  loadKnownMoveListTags() {
    apiLoadKnownMoveListTags().then(
      action((tags: TagT[]) => {
        this.moveListTagsMap = addTags([tags], this.moveListTagsMap);
      })
    );
  }

  @computed get moveTags() {
    return keys(this.moveTagsMap);
  }

  @computed get moveListTags() {
    return keys(this.moveListTagsMap);
  }

  @action addMoveTags(tags: Array<Array<TagT>>) {
    addTags(tags, this.moveTagsMap);
  }

  @action addMoveListTags(tags: Array<Array<TagT>>) {
    addTags(tags, this.moveListTagsMap);
  }

  loadKnownTags() {
    this.loadKnownMoveTags();
    this.loadKnownMoveListTags();
  }
}
