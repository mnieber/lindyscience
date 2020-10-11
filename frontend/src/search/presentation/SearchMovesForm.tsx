import React from 'react';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useFormStateContext } from 'react-form-state-context';
import { strToPickerValue } from 'src/utils/value_picker';
import { Display } from 'src/session/facets/Display';
import { TagT } from 'src/tags/types';
import { mergeDefaultProps } from 'react-default-props-context';
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from 'src/search/utils/TagsAndKeywordsPicker';
import { makeUnique } from 'src/utils/utils';
import { FormStateProvider, HandleSubmitArgsT } from 'react-form-state-context';

type PropsT = {
  onSubmit: (values: any) => any;
  knownTags: Array<TagT>;
  autoFocus: boolean;
  latestOptions: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  display: Display;
};

export const SearchMovesForm: React.FC<PropsT> = observer((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const [defaults] = React.useState({});

  const initialValues = {
    tags: [],
    searchText: '',
    ...props.latestOptions,
  };

  const initialErrors = {};

  const handleValidate = () => {};

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    const splitResult = splitTextIntoTagsAndKeywords(values.searchText);
    const allTags = makeUnique([...splitResult.tags, ...values.tags]);
    props.onSubmit({
      ...values,
      keywords: splitResult.keywords,
      tags: allTags,
    });
  };

  const placeholder = props.display.small
    ? 'Search moves'
    : 'Search moves by :tags, keywords and user:me';

  const tagsAndKeywordsField = (
    <div className="moveForm__tags mt-2 ml-2 w-full">
      <TagsAndKeywordsPicker
        options={props.knownTags.map(strToPickerValue)}
        placeholder={placeholder}
        zIndex={10}
        defaults={defaults}
      />
    </div>
  );

  const SearchBtn = () => {
    const formState = useFormStateContext();
    return (
      <FontAwesomeIcon
        key={1}
        className="ml-4"
        icon={faSearch}
        size="lg"
        onClick={() => {
          formState.submit();
        }}
      />
    );
  };

  return (
    <FormStateProvider
      initialValues={initialValues}
      initialErrors={initialErrors}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <form className="searchMovesForm w-full max-w-lg">
        <div className={'flexcol'}>
          <div className={'flexrow items-center'}>
            {tagsAndKeywordsField}
            <div className={'moveForm__buttonPanel flexrow mt-4'}>
              <SearchBtn />
            </div>
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
});
