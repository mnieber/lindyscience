///////////////////////////////////////////////////////////////////////
// Tags
///////////////////////////////////////////////////////////////////////

import { TagMapT, TagT } from 'src/tags/types';

export const createTagMap = (tags: Array<string>): TagMapT => {
  return tags.reduce((acc: any, tag: any) => {
    acc[tag] = true;
    return acc;
  }, {});
};

export function addTags(listOfTagLists: Array<Array<TagT>>, tagMap: TagMapT) {
  return listOfTagLists.reduce(
    (acc, tags) => {
      tags.forEach((tag) => {
        acc[tag] = true;
      });
      return acc;
    },
    { ...tagMap }
  );
}
