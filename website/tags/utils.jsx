// @flow
import type { TagT, TagMapT } from "tags/types";

///////////////////////////////////////////////////////////////////////
// Tags
///////////////////////////////////////////////////////////////////////

export const createTagMap = (tags: Array<string>): TagMapT => {
  return tags.reduce((acc, tag) => {
    acc[tag] = true;
    return acc;
  }, ({}: TagMapT));
};

type TagsStateT = {
  moveTags: TagMapT,
  moveListTags: TagMapT,
};

export function addTags(listOfTagLists: Array<Array<TagT>>, tagMap: TagMapT) {
  return listOfTagLists.reduce(
    (acc, tags) => {
      tags.forEach(tag => {
        acc[tag] = true;
      });
      return acc;
    },
    { ...tagMap }
  );
}
