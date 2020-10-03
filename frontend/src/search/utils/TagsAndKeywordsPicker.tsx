import { isNone, makeUnique } from 'src/utils/utils';
import React from 'react';
// $FlowFixMe
import Select from 'react-select';

const _cache: { [input: string]: any } = {};

function _getSearchInput(input: string) {
  let result = _cache[input];
  if (!isNone(result)) {
    return result;
  }

  const words = input.split(' ');
  words.forEach((word) => {
    if (word.startsWith(':')) {
      result = word.slice(1);
    }
  });

  _cache[input] = result;
  return result;
}

export function splitTextIntoTagsAndKeywords(inputValue: string) {
  const words = inputValue.split(' ');
  const chop = (x: string) => (x.endsWith(':') ? x.slice(0, x.length - 1) : x);
  return {
    keywords: makeUnique(words.filter((x) => !!x && !x.startsWith(':'))),
    tags: makeUnique(
      words
        .filter((x) => x.startsWith(':'))
        .map((x) => x.slice(1))
        .map(chop)
    ),
  };
}

type PropsT = {
  zIndex?: number;
  onChange?: Function;
  onTextChange?: Function;
  options?: any;
  placeholder?: string;
  forwardedRef?: any;
  defaults: any;
};

export function TagsAndKeywordsPicker(props: PropsT) {
  const [hasEnter, setHasEnter] = React.useState(false);
  const [textChanged, setTextChanged] = React.useState(false);
  const [value, setValue] = React.useState(props.defaults.value || []);
  const [inputValue, setInputValue] = React.useState(
    props.defaults.inputValue || ''
  );

  if (hasEnter) {
    setHasEnter(false);
    if (props.onChange) {
      const tags = value.map((x) => x.value);
      if (props.onChange) props.onChange(tags, inputValue);
    }
  }

  if (textChanged) {
    setTextChanged(false);
    if (props.onTextChange) {
      const tags = value.map((x) => x.value);
      if (props.onTextChange) props.onTextChange(tags, inputValue);
    }
  }

  const saveChanges = (value: any) => {
    const newInputValue = inputValue
      .split(' ')
      .filter((x) => !x.startsWith(':'))
      .join(' ');
    setInputValue(newInputValue);
    props.defaults.inputValue = newInputValue;

    setValue(value);
    props.defaults.value = value;
  };

  const onInputChange = (inputValue, { action }) => {
    setTextChanged(true);
    switch (action) {
      case 'input-change':
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
      (searchInput == '' || candidate.label.includes(searchInput))
    );
  };

  const onKeyDown = (event) => {
    if (event.keyCode == 13) {
      setHasEnter(true);
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
