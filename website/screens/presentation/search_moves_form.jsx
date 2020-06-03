// @flow

import React from "react";
import { observer } from "mobx-react";
import { withFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Display } from "screens/session_container/facets/display";
import { mergeDefaultProps } from "mergeDefaultProps";
import { makeUnique } from "utils/utils";
import { FormFieldError } from "utils/form_utils";
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from "search/utils/tags_and_keywords_picker";
import { strToPickerValue } from "utils/value_picker";
import type { TagT } from "tags/types";

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerOptions: Array<any>,
  defaults: any,
  display: Display,
};

const InnerForm = (props: InnerFormPropsT) =>
  observer(formProps => {
    const placeholder = props.display.small
      ? "Search moves"
      : "Search moves by :tags, keywords and user:me";

    const _onPickerTextChange = (tags, searchText) => {
      formProps.setFieldValue("tags", tags);
      formProps.setFieldValue("searchText", searchText);
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
          classNames={["formField__error"]}
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
        <div className={"flexcol"}>
          <div className={"flexrow items-center"}>
            {tagsAndKeywordsField}
            <div className={"moveForm__buttonPanel flexrow mt-4"}>
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
  defaultProps: any,
};

type DefaultPropsT = {
  display: Display,
};

export const SearchMovesForm = observer((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
  const [defaults, setDefaults] = React.useState({});

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      tags: [],
      searchText: "",
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
    displayName: "BasicForm", // helps with React DevTools
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
