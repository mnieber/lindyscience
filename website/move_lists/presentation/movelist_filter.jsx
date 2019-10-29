// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import { mergeDefaultProps } from "screens/default_props";
import { Highlight } from "facet-mobx/facets/highlight";
import { createTagsAndKeywordsFilter } from "screens/utils";
import { Filtering } from "facet-mobx/facets/filtering";
import { Selection } from "facet-mobx/facets/selection";
import { Addition } from "facet-mobx/facets/addition";
import { MovesContainer } from "screens/moves_container/moves_container";
import { makeUnique } from "utils/utils";
import {
  TagsAndKeywordsPicker,
  splitTextIntoTagsAndKeywords,
} from "search/utils/tags_and_keywords_picker";
import { ValuePicker, strToPickerValue } from "utils/value_picker";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";

// MoveListPicker

type MoveListPickerPropsT = {|
  filter: MoveListT => boolean,
  className?: string,
  navigateTo: MoveListT => any,
  defaultProps: any,
|} & {
  // default props
  moveListsAddition: Addition,
  moveListsHighlight: Highlight,
  moveListsSelection: Selection,
  moveLists: Array<MoveListT>,
};

// $FlowFixMe
export const MoveListPicker = compose(observer)((p: MoveListPickerPropsT) => {
  const props = mergeDefaultProps(p);

  function _onChange(pickedItem) {
    if (!props.moveLists.some(x => x.id === pickedItem.value)) {
      props.moveListsAddition.add({ name: pickedItem.label });
      props.navigateTo(props.moveListsAddition.item);
    }
  }

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name,
    };
  }

  const options = props.moveLists.filter(props.filter).map(toPickerValue);
  const option = options.find(x => x.value == props.moveListsHighlight.id);

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
            props.moveListsSelection.selectItem({
              itemId: x.value,
              isShift: false,
              isCtrl: false,
            });
            props.navigateTo(props.moveListsHighlight.item);
          }
        }}
      />
    </div>
  );
});

// MoveListFilter

type MoveListFilterPropsT = {|
  moveTags: Array<TagT>,
  movesFiltering: Filtering,
  className?: string,
|};

export const MoveListFilter = observer((props: MoveListFilterPropsT) => {
  const isFilterEnabled = props.movesFiltering.isEnabled;

  function _onPickerChange(tags, text) {
    const splitResult = splitTextIntoTagsAndKeywords(text);
    const allTags = makeUnique([...splitResult.tags, ...tags]);
    props.movesFiltering.apply(
      createTagsAndKeywordsFilter(allTags, splitResult.keywords)
    );
  }

  const onFlagChanged = () => {
    props.movesFiltering.setEnabled(!isFilterEnabled);
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
