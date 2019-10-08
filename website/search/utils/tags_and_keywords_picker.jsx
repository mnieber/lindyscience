// @flow

import React from "react";
// $FlowFixMe
import Select from "react-select";
// $FlowFixMe
import jQuery from "jquery";

import { handleEnterAsTabToNext } from "utils/form_utils";
import { isNone } from "utils/utils";

const _cache = {};

function _getSearchInput(input) {
  let result = _cache[input];
  if (!isNone(result)) {
    return result;
  }

  const words = input.split(" ");
  if (words.length) {
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith(":")) {
      result = lastWord.slice(1);
    }
  }

  _cache[input] = result;
  return result;
}

function makeUnique(x: Array<any>) {
  // $FlowFixMe
  return Array.from(new Set(x));
}

export function splitTextIntoTagsAndKeywords(inputValue: string) {
  const words = inputValue.split(" ");
  const chop = x => (x.endsWith(":") ? x.slice(0, x.length - 1) : x);
  return {
    keywords: makeUnique(words.filter(x => !!x && !x.startsWith(":"))),
    tags: makeUnique(
      words
        .filter(x => x.startsWith(":"))
        .map(x => x.slice(1))
        .map(chop)
    ),
  };
}

type TagsAndKeywordsPickerPropsT = {
  zIndex?: number,
  onChange?: Function,
  onTextChange?: Function,
  options?: any,
  placeholder?: string,
  forwardedRef?: any,
  defaults: any,
};

export function TagsAndKeywordsPicker(props: TagsAndKeywordsPickerPropsT) {
  const [value, setValue] = React.useState(props.defaults.value || []);
  const [inputValue, setInputValue] = React.useState(
    props.defaults.inputValue || ""
  );

  const _complete = (inputValue, label) => {
    const words = inputValue.split(" ");
    const delta =
      words.length && words[words.length - 1].startsWith(":") ? 1 : 0;
    return words.slice(0, words.length - delta).join(" ");
  };

  const saveChanges = (value: any) => {
    if (value.length) {
      const label = value[0].label;
      const newInputValue = _complete(inputValue, label);
      setInputValue(newInputValue);
      props.defaults.inputValue = newInputValue;
    }
    setValue(value);
    props.defaults.value = value;
  };

  const onInputChange = (inputValue, { action }) => {
    if (props.onTextChange) {
      props.onTextChange(inputValue);
    }
    switch (action) {
      case "input-change":
        setInputValue(inputValue);
        props.defaults.inputValue = inputValue;
        return;
      default:
        return;
    }
  };

  const filterOption = (candidate: any, input: string) => {
    const searchInput = _getSearchInput(input);
    return (
      !isNone(searchInput) &&
      (searchInput == "" || candidate.label.includes(searchInput))
    );
  };

  const onKeyDown = event => {
    if (event.keyCode == 13) {
      const splitResults = splitTextIntoTagsAndKeywords(inputValue);
      if (props.onChange) {
        props.onChange(splitResults.tags, splitResults.keywords);
      }
    }
  };

  const pickerProps = {
    isMulti: true, // yes, we need this
    options: props.options,
    value: value,
    placeholder: props.placeholder,
    onChange: saveChanges,
    noOptionsMessage: () => null,
    onKeyDown,
    inputValue,
    onInputChange,
    filterOption,
    ref: props.forwardedRef,
  };

  const picker = <Select {...pickerProps} />;

  return <div style={{ zIndex: props.zIndex }}>{picker}</div>;
}
