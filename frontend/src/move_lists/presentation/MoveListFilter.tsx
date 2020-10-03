import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { TagT } from 'src/tags/types';
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from 'src/search/utils/TagsAndKeywordsPicker';
import { strToPickerValue } from 'src/utils/value_picker';
import { makeUnique } from 'src/utils/utils';
import { createTagsAndKeywordsFilter } from 'src/app/utils';
import { Filtering } from 'src/npm/facet-mobx/facets/filtering';

type PropsT = {
  moveTags: Array<TagT>;
  movesFiltering: Filtering;
  className?: string;
};

export const MoveListFilter: React.FC<PropsT> = observer((props: PropsT) => {
  const isFilterEnabled = props.movesFiltering.isEnabled;

  function _onPickerChange(tags: string[], text: string) {
    const splitResult = splitTextIntoTagsAndKeywords(text);
    const allTags = makeUnique([...splitResult.tags, ...tags]);
    props.movesFiltering.apply(
      createTagsAndKeywordsFilter(allTags, splitResult.keywords)
    );
  }

  const onFlagChanged = () => {
    props.movesFiltering.setEnabled(!isFilterEnabled);
  };

  const flag = (
    <FontAwesomeIcon
      key={'filter'}
      className={classnames('mr-2', {
        'opacity-25': !isFilterEnabled,
      })}
      icon={faFilter}
      size="lg"
      onClick={onFlagChanged}
    />
  );

  const tagsAndKeywordsPicker = (
    <div className="w-full">
      <TagsAndKeywordsPicker
        options={props.moveTags.map(strToPickerValue)}
        placeholder="Filter by :tags and keywords"
        onChange={_onPickerChange}
        defaults={{}}
      />
    </div>
  );

  return (
    <div
      className={classnames(
        'bg-grey p-2 moveListFilter mt-4 flexrow items-center',
        props.className
      )}
    >
      {flag}
      {tagsAndKeywordsPicker}
    </div>
  );
});
