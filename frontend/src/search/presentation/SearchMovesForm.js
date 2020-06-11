// @flow

import { values } from 'rambda';
import React from 'react';
import { observer } from 'mobx-react';
import { withFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { Display } from 'src/session/facets/Display';
import type { TagT } from 'src/tags/types';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';
import { strToPickerValue } from 'src/utils/value_picker';
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from 'src/search/utils/TagsAndKeywordsPicker';
import { FormFieldError } from 'src/utils/form_utils';
import { makeUnique } from 'src/utils/utils';

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerOptions: Array<any>,
  defaults: any,
  display: Display,
};

const InnerForm = (props: InnerFormPropsT) =>
  observer((formProps) => {
    const placeholder = props.display.small
      ? 'Search moves'
      : 'Search moves by :tags, keywords and user:me';

    const _onPickerTextChange = (tags, searchText) => {
      formProps.setFieldValue('tags', tags);
      formProps.setFieldValue('searchText', searchText);
    };

    const tagsAndKeywordsField = (
      <div className="moveForm__tags mt-2 ml-2 w-full">
        <TagsAndKeywordsPicker
          options={props.tagPickerOptions}
          placeholder={placeholder}
          onTextChange={_onPickerTextChange}
          zIndex={10}
          label="Tags"
          fieldName="tags"
          defaults={props.defaults}
        />
        <FormFieldError
          formProps={formProps}
          fieldName="tags"
          classNames={['formField__error']}
          key="error"
        />
      </div>
    );

    const hiddenSearchBtnRef = React.createRef();

    const hiddenSearchBtn = (
      <button
        ref={hiddenSearchBtnRef}
        className="hidden"
        type="submit"
        disabled={formProps.isSubmitting}
      >
        search
      </button>
    );

    const searchBtn = (
      <FontAwesomeIcon
        key={1}
        className="ml-4"
        icon={faSearch}
        size="lg"
        onClick={() => {
          if (hiddenSearchBtnRef.current) {
            hiddenSearchBtnRef.current.click();
          }
        }}
      />
    );

    return (
      <form
        className="searchMovesForm w-full max-w-lg"
        onSubmit={formProps.handleSubmit}
      >
        <div className={'flexcol'}>
          <div className={'flexrow items-center'}>
            {tagsAndKeywordsField}
            <div className={'moveForm__buttonPanel flexrow mt-4'}>
              {!props.display.small && searchBtn}
              {hiddenSearchBtn}
            </div>
          </div>
        </div>
      </form>
    );
  });

// SearchMovesForm

type PropsT = {
  onSubmit: (values: any) => any,
  knownTags: Array<TagT>,
  autoFocus: boolean,
  latestOptions: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  display: Display,
};

export const SearchMovesForm: (PropsT) => any = observer((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const [defaults, setDefaults] = React.useState({});

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      tags: [],
      searchText: '',
      ...props.latestOptions,
    }),

    validate: (values, formProps) => {
      let errors = {};
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      const splitResult = splitTextIntoTagsAndKeywords(values.searchText);
      const allTags = makeUnique([...splitResult.tags, ...values.tags]);
      props.onSubmit({
        ...values,
        keywords: splitResult.keywords,
        tags: allTags,
      });
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      defaults,
      display: props.display,
    })
  );

  return <EnhancedForm />;
});
