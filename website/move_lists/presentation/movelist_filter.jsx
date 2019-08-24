// @flow

import * as React from "react";
import classnames from "classnames";
import { ValuePicker, strToPickerValue } from "utils/form_utils";
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
  function _onChange(pickedItem) {
    props.selectMoveListById(pickedItem.value);
  }

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name,
    };
  }

  const defaultMoveList = props.moveLists.find(
    x => x.id == props.defaultMoveListId
  );

  return (
    <div className={classnames("moveListPicker mt-4", props.className)}>
      <ValuePicker
        key={props.defaultMoveListId}
        isMulti={false}
        options={props.moveLists.map(toPickerValue)}
        placeholder="Select a move list"
        onChange={_onChange}
        defaultValue={
          defaultMoveList ? toPickerValue(defaultMoveList) : undefined
        }
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

  React.useEffect(() => {
    props.filterMoves(
      props.isFilterEnabled ? tags : [],
      props.isFilterEnabled ? keywords : []
    );
  }, [props.isFilterEnabled, tags, keywords]);

  function _onKeywordsChange(e) {
    props.setIsFilterEnabled(true);
    if (inputRef.current) {
      setKeywords(splitIntoKeywords(inputRef.current.value));
    }
  }

  function _onTagsChange(pickedTags) {
    props.setIsFilterEnabled(true);
    setTags(pickedTags.map(x => x.value));
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

  const valuePicker = (
    <ValuePicker
      isMulti={true}
      options={props.moveTags.map(strToPickerValue)}
      placeholder="Enter search tags here"
      onChange={_onTagsChange}
    />
  );

  const inputElm = (
    // $FlowFixMe
    <input
      ref={inputRef}
      className="my-2 border rounded p-2 w-full"
      placeholder="Enter search keywords here"
      onChange={_onKeywordsChange}
    />
  );

  return (
    <div
      className={classnames("bg-grey p-2 moveListFilter mt-4", props.className)}
    >
      {flag}
      {valuePicker}
      {inputElm}
    </div>
  );
}
