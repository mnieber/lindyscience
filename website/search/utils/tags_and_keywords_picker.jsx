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
    if (lastWord.startsWith("t:")) {
      result = lastWord.slice(2);
    }
  }

  _cache[input] = result;
  return result;
}

type TagsAndKeywordsPickerPropsT = {
  zIndex?: number,
  onChange?: Function,
  options?: any,
  placeholder?: string,
  forwardedRef?: any,
};

export function TagsAndKeywordsPicker(props: TagsAndKeywordsPickerPropsT) {
  const [inputValue, setInputValue] = React.useState("");

  const _complete = (inputValue, label) => {
    const words = inputValue.split(" ");
    words[words.length - 1] = "t:" + label + ":";
    return words.join(" ") + " ";
  };

  const makeUnique = x => Array.from(new Set(x));

  const _split = inputValue => {
    const words = inputValue.split(" ");
    const chop = x => (x.endsWith(":") ? x.slice(0, x.length - 1) : x);
    return {
      keywords: makeUnique(words.filter(x => !!x && !x.startsWith("t:"))),
      tags: makeUnique(
        words
          .filter(x => x.startsWith("t:"))
          .map(x => x.slice(2))
          .map(chop)
      ),
    };
  };

  const saveChanges = (value: any) => {
    if (value.length) {
      const label = value[0].label;
      const newInputValue = _complete(inputValue, label);
      setInputValue(newInputValue);
    }
  };

  const onInputChange = (inputValue, { action }) => {
    switch (action) {
      case "input-change":
        setInputValue(inputValue);
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
      const splitResults = _split(inputValue);
      if (props.onChange) {
        props.onChange(splitResults.tags, splitResults.keywords);
      }
    }
  };

  const pickerProps = {
    isMulti: true, // yes, we need this
    options: props.options,
    placeholder: props.placeholder,
    value: [],
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
