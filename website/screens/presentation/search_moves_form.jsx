// @flow

import React from "react";
import { withFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { makeUnique, slugify } from "utils/utils";
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from "search/utils/tags_and_keywords_picker";
import { FormField, FormFieldError, FormFieldLabel } from "utils/form_utils";
import { strToPickerValue } from "utils/value_picker";
import { newMoveSlug } from "moves/utils";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerOptions: Array<any>,
  defaults: any,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const myMoveLists = (
    <FormField
      classNames=""
      postfix="Search only my move lists"
      formProps={formProps}
      fieldName="myMoveLists"
      type="checkbox"
    />
  );

  const _onPickerTextChange = (tags, searchText) => {
    formProps.setFieldValue("tags", tags);
    formProps.setFieldValue("searchText", searchText);
  };

  const tagsAndKeywordsField = (
    <div className="moveForm__tags mt-2 w-full">
      <TagsAndKeywordsPicker
        options={props.tagPickerOptions}
        placeholder="Search moves by :tags and keywords"
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
      className="moveForm w-full max-w-lg"
      onSubmit={formProps.handleSubmit}
    >
      <div className={"flexcol"}>
        <div className={"flexrow items-center"}>
          {tagsAndKeywordsField}
          <div className={"moveForm__buttonPanel flexrow mt-4"}>
            {searchBtn}
            {hiddenSearchBtn}
          </div>
        </div>
        {myMoveLists}
      </div>
    </form>
  );
};

// SearchMovesForm

type SearchMovesFormPropsT = {
  onSubmit: (values: any) => any,
  knownTags: Array<TagT>,
  autoFocus: boolean,
  latestOptions: any,
};

export function SearchMovesForm(props: SearchMovesFormPropsT) {
  const [defaults, setDefaults] = React.useState({});

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      tags: [],
      searchText: "",
      myMoveLists: false,
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
    })
  );

  return <EnhancedForm />;
}
