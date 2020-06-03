// @flow

import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { strToPickerValue } from 'src/utils/value_picker';
import { createTagsAndKeywordsFilter } from 'src/screens/utils';
import { Filtering } from 'src/facet-mobx/facets/filtering';
import { makeUnique } from 'src/utils/utils';
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from 'src/search/utils/tags_and_keywords_picker';
import type { TagT } from 'src/tags/types';

type PropsT = {|
  moveTags: Array<TagT>,
  movesFiltering: Filtering,
  className?: string,
|};

export const MoveListFilter: (PropsT) => any = observer((props: PropsT) => {
  const isFilterEnabled = props.movesFiltering.isEnabled;

  function _onPickerChange(tags, text) {
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
