import { apiLoadKnownMoveListTags, apiLoadKnownMoveTags } from 'src/tags/api';
import { TagMapT, TagT } from 'src/tags/types';
import { observable, computed } from 'src/utils/mobx_wrapper';
import { addTags } from 'src/tags/utils';
import { operation } from 'facility';
import { keys } from 'lodash/fp';

export class TagsStore {
  @observable moveTagsMap: TagMapT = {};
  @observable moveListTagsMap: TagMapT = {};

  @operation loadKnownMoveTags() {
    apiLoadKnownMoveTags().then((tags: TagT[]) => {
      this.moveTagsMap = addTags([tags], this.moveTagsMap);
    });
  }

  @operation loadKnownMoveListTags() {
    apiLoadKnownMoveListTags().then((tags: TagT[]) => {
      this.moveListTagsMap = addTags([tags], this.moveListTagsMap);
    });
  }

  @computed get moveTags() {
    return keys(this.moveTagsMap);
  }

  @computed get moveListTags() {
    return keys(this.moveListTagsMap);
  }

  addMoveTags(tags: Array<Array<TagT>>) {
    addTags(tags, this.moveTagsMap);
  }

  addMoveListTags(tags: Array<Array<TagT>>) {
    addTags(tags, this.moveListTagsMap);
  }

  loadKnownTags() {
    this.loadKnownMoveTags();
    this.loadKnownMoveListTags();
  }
}
