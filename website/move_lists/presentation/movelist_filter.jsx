// @flow

import * as React from "react";
import classnames from "classnames";

import { TagsAndKeywordsPicker } from "search/utils/tags_and_keywords_picker";
import { ValuePicker, strToPickerValue } from "utils/value_picker";
import { splitIntoKeywords } from "utils/utils";

import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

// MoveListPicker

type MoveListPickerPropsT = {|
  moveLists: Array<MoveListT>,
  defaultMoveListId: UUID,
  className?: string,
  selectMoveListById: UUID => void,
|};

export function MoveListPicker(props: MoveListPickerPropsT) {
  const defaultMoveList = props.moveLists.find(
    x => x.id == props.defaultMoveListId
  );

  const [moveListPickerValue, setMoveListPickerValue] = React.useState(
    defaultMoveList ? toPickerValue(defaultMoveList) : undefined
  );

  function _onChange(pickedItem) {
    props.selectMoveListById(pickedItem.value);
  }

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name,
    };
  }

  return (
    <div className={classnames("moveListPicker mt-4", props.className)}>
      <ValuePicker
        key={props.defaultMoveListId}
        isMulti={false}
        options={props.moveLists.map(toPickerValue)}
        placeholder="Select a move list"
        onChange={_onChange}
        value={moveListPickerValue}
        setValue={setMoveListPickerValue}
      />
    </div>
  );
}

// MoveListFilter

type MoveListFilterPropsT = {|
  isFilterEnabled: boolean,
  setIsFilterEnabled: boolean => void,
  moveTags: Array<TagT>,
  filterMoves: (Array<TagT>, Array<string>) => void,
  className?: string,
|};

export function MoveListFilter(props: MoveListFilterPropsT) {
  const inputRef = React.useRef(null);
  const [tags, setTags] = React.useState([]);
  const [keywords, setKeywords] = React.useState([]);
  const [defaults, setDefaults] = React.useState({});

  React.useEffect(() => {
    props.filterMoves(
      props.isFilterEnabled ? tags : [],
      props.isFilterEnabled ? keywords : []
    );
  }, [props.isFilterEnabled, tags, keywords]);

  function _onPickerChange(tags, keywords) {
    props.setIsFilterEnabled(true);
    setTags(tags);
    setKeywords(keywords);
  }

  const onFlagChanged = () => {
    props.setIsFilterEnabled(!props.isFilterEnabled);
  };

  const flag = (
    <div>
      <input
        type="checkbox"
        className="mr-2"
        checked={props.isFilterEnabled}
        onChange={onFlagChanged}
      />
      Filter
    </div>
  );

  const tagsAndKeywordsPicker = (
    <TagsAndKeywordsPicker
      options={props.moveTags.map(strToPickerValue)}
      placeholder="Enter tags and keywords here"
      onChange={_onPickerChange}
      defaults={defaults}
    />
  );

  return (
    <div
      className={classnames("bg-grey p-2 moveListFilter mt-4", props.className)}
    >
      {flag}
      {tagsAndKeywordsPicker}
    </div>
  );
}
