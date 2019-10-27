// @flow

import * as React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import { Highlight } from "facets/generic/highlight";
import { createTagsAndKeywordsFilter } from "screens/utils";
import { Filtering } from "facets/generic/filtering";
import { Selection } from "facets/generic/selection";
import { Addition } from "facets/generic/addition";
import { MovesContainer } from "screens/moves_container/moves_container";
import { makeUnique } from "utils/utils";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from "search/utils/tags_and_keywords_picker";
import { ValuePicker, strToPickerValue } from "utils/value_picker";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";

// MoveListPicker

type MoveListPickerPropsT = {|
  moveListsCtr: MoveListsContainer,
  filter: MoveListT => boolean,
  className?: string,
  navigateTo: MoveListT => any,
|};

export const MoveListPicker = observer((props: MoveListPickerPropsT) => {
  const ctr = props.moveListsCtr;
  const moveListId = ctr.highlight.id;
  const moveLists = ctr.data.display;

  function _onChange(pickedItem) {
    if (!moveLists.some(x => x.id === pickedItem.value)) {
      Addition.get(ctr).add({ name: pickedItem.label });
      props.navigateTo(Addition.get(ctr).item);
    }
  }

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name,
    };
  }

  const options = moveLists.filter(props.filter).map(toPickerValue);
  const option = options.find(x => x.value == moveListId);

  return (
    <div className={classnames("moveListPicker mt-2", props.className)}>
      <ValuePicker
        isMulti={false}
        isCreatable={true}
        options={options}
        placeholder="Select a move list"
        onChange={_onChange}
        value={option}
        setValue={x => {
          if (options.includes(x)) {
            Selection.get(ctr).selectItem({
              itemId: x.value,
              isShift: false,
              isCtrl: false,
            });
            props.navigateTo(Highlight.get(ctr).item);
          }
        }}
      />
    </div>
  );
});

// MoveListFilter

type MoveListFilterPropsT = {|
  moveTags: Array<TagT>,
  movesCtr: MovesContainer,
  className?: string,
|};

export const MoveListFilter = observer((props: MoveListFilterPropsT) => {
  const ctr = props.movesCtr;

  const isFilterEnabled = props.movesCtr.filtering.isEnabled;

  function _onPickerChange(tags, text) {
    const splitResult = splitTextIntoTagsAndKeywords(text);
    const allTags = makeUnique([...splitResult.tags, ...tags]);
    Filtering.get(ctr).apply(
      createTagsAndKeywordsFilter(allTags, splitResult.keywords)
    );
  }

  const onFlagChanged = () => {
    Filtering.get(ctr).setEnabled(!isFilterEnabled);
  };

  const flag = (
    <FontAwesomeIcon
      key={"filter"}
      className={classnames("mr-2", {
        "opacity-25": !isFilterEnabled,
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
        defaults={{}}
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
});
