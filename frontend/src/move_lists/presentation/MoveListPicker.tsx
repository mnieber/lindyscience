import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { MoveListT } from 'src/move_lists/types';
import { ValuePicker } from 'src/utils/value_picker';
import { Addition } from 'src/npm/facet-mobx/facets/addition';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';
import { Selection } from 'src/npm/facet-mobx/facets/selection';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';

type PropsT = {
  filter: (moveList: MoveListT) => boolean;
  className?: string;
  navigateTo: (moveList: MoveListT) => any;
  defaultProps?: any;
};

type DefaultPropsT = {
  moveListsAddition: Addition;
  moveListsHighlight: Highlight;
  moveListsSelection: Selection;
  moveLists: Array<MoveListT>;
};

type PickerItem = {
  value: string;
  label: string;
};

export const MoveListPicker: React.FC<PropsT> = observer((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  function _onChange(pickedItem: PickerItem) {
    if (!props.moveLists.some((x) => x.id === pickedItem.value)) {
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
  const option = options.find((x) => x.value === props.moveListsHighlight.id);

  return (
    <div className={classnames('moveListPicker mt-2', props.className)}>
      <ValuePicker
        fieldName="moveList"
        isMulti={false}
        isCreatable={true}
        options={options}
        placeholder="Select a move list"
        onChange={_onChange}
        value={option}
        setValue={(x: PickerItem) => {
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
