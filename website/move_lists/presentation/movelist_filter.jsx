// @flow

import * as React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from "search/utils/tags_and_keywords_picker";
import { makeUnique, splitIntoKeywords } from "utils/utils";
import { ValuePicker, strToPickerValue } from "utils/value_picker";
import { makeIdMatcher } from "screens/utils";

import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

// MoveListPicker

type MoveListPickerPropsT = {|
  moveLists: Array<MoveListT>,
  defaultMoveListId: UUID,
  className?: string,
  createMoveList: any => ?MoveListT,
  selectMoveListById: UUID => void,
|};

export function MoveListPicker(props: MoveListPickerPropsT) {
  const defaultMoveList = props.moveLists.find(
    makeIdMatcher(props.defaultMoveListId)
  );

  const [moveListPickerValue, setMoveListPickerValue] = React.useState(
    defaultMoveList ? toPickerValue(defaultMoveList) : undefined
  );

  function _onChange(pickedItem) {
    const moveListId = pickedItem.value;
    if (props.moveLists.some(makeIdMatcher(moveListId))) {
      props.selectMoveListById(moveListId);
    } else {
      props.createMoveList({ name: pickedItem.label });
    }
  }

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name,
    };
  }

  return (
    <div className={classnames("moveListPicker mt-2", props.className)}>
      <ValuePicker
        isMulti={false}
        isCreatable={true}
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

  function _onPickerChange(tags, text) {
    const splitResult = splitTextIntoTagsAndKeywords(text);

    const allTags = makeUnique([...splitResult.tags, ...tags]);
    props.setIsFilterEnabled(true);
    setTags(allTags);
    setKeywords(splitResult.keywords);
  }

  const onFlagChanged = () => {
    props.setIsFilterEnabled(!props.isFilterEnabled);
  };

  const flag = (
    <FontAwesomeIcon
      key={"filter"}
      className={classnames("mr-2", {
        "opacity-25": !props.isFilterEnabled,
      })}
      icon={faFilter}
      size="lg"
      onClick={onFlagChanged}
    />
  );

  const tagsAndKeywordsPicker = (
    <div className="w-full">
      <TagsAndKeywordsPicker
        options={props.moveTags.map(strToPickerValue)}
        placeholder="Filter by :tags and keywords"
        onChange={_onPickerChange}
        defaults={defaults}
      />
    </div>
  );

  return (
    <div
      className={classnames(
        "bg-grey p-2 moveListFilter mt-4 flexrow items-center",
        props.className
      )}
    >
      {flag}
      {tagsAndKeywordsPicker}
    </div>
  );
}
