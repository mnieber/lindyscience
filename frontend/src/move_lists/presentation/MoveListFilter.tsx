import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { TagT } from 'src/tags/types';
import { TagsAndKeywordsPicker } from 'src/search/utils/TagsAndKeywordsPicker';
import { createTagsAndKeywordsFilter } from 'src/app/utils';
import { Filtering } from 'facet-mobx/facets/Filtering';

type PropsT = {
  moveTags: Array<TagT>;
  movesFiltering: Filtering;
  className?: string;
};

export const MoveListFilter: React.FC<PropsT> = observer((props: PropsT) => {
  const isFilterEnabled = props.movesFiltering.isEnabled;

  function _onPickerChange({
    tags,
    keywords,
  }: {
    tags: string[];
    keywords: string[];
  }) {
    props.movesFiltering.apply(createTagsAndKeywordsFilter(tags, keywords));
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
        knownTags={props.moveTags}
        placeholder="Filter by :tags and keywords"
        onChange={_onPickerChange}
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
