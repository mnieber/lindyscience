// @flow

import * as React from 'react'
import type { MoveListT, TagT } from 'moves/types'
import type { UUID } from 'app/types';
import classnames from 'classnames';
import {
  ValuePicker, strToPickerValue
} from 'utils/form_utils'


// MoveListPicker

type MoveListPickerPropsT = {|
  moveLists: Array<MoveListT>,
  defaultMoveListId: UUID,
  selectMoveListById: Function,
  className?: string,
|};

export function MoveListPicker(props: MoveListPickerPropsT) {
  function _onChange(pickedItem) {
    props.selectMoveListById(pickedItem.value);
  }

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name
    }
  }

  const defaultMoveList = props.moveLists.find(x => x.id == props.defaultMoveListId);

  return (
    <div className= {classnames("moveListPicker mt-4", props.className)}>
      <ValuePicker
        key={props.defaultMoveListId}
        isMulti={false}
        options={props.moveLists.map(toPickerValue)}
        placeholder="Select a move list"
        onChange={_onChange}
        defaultValue={defaultMoveList ? toPickerValue(defaultMoveList) : undefined}
      />
    </div>
  );
}


// MoveListFilter

type MoveListFilterPropsT = {|
  moveTags: Array<TagT>,
  setMoveListFilter: Function,
  className?: string,
|};

export function MoveListFilter(props: MoveListFilterPropsT) {
  function _onChange(pickedTags) {
    props.setMoveListFilter(pickedTags.map(x => x.value), true);
  }

  return (
    <div className= {classnames("moveListFilter mt-4", props.className)}>
      <ValuePicker
        isMulti={true}
        options={props.moveTags.map(strToPickerValue)}
        placeholder="Enter search tags here"
        onChange={_onChange}
      />
    </div>
  );
}
