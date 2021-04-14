import classnames from 'classnames';
import { observer } from 'mobx-react';

import { PickerValueT, ValuePicker } from 'src/utils/components/ValuePicker';
import { MoveListT } from 'src/movelists/types';
import { Addition } from 'skandha-facets/Addition';
import { Highlight } from 'skandha-facets/Highlight';
import { Selection } from 'skandha-facets/Selection';
import { useDefaultProps, FC } from 'react-default-props-context';

type PropsT = {
  filter: (moveList: MoveListT) => boolean;
  className?: string;
};

type DefaultPropsT = {
  moveListsAddition: Addition;
  moveListsHighlight: Highlight;
  moveListsSelection: Selection;
  moveLists: Array<MoveListT>;
};

export const MoveListPicker: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const onChange = (value: PickerValueT) => {
      if (value.__isNew__) {
        props.moveListsAddition.add({ name: value.label });
      } else if (value.value) {
        props.moveListsSelection.selectItem({
          itemId: value.value.id,
        });
      }
    };

    return (
      <div className={classnames('MoveListPicker mt-2', props.className)}>
        <ValuePicker
          isMulti={false}
          isCreatable={true}
          pickableValues={props.moveLists.filter(props.filter)}
          labelFromValue={(x: any) => x.name}
          pickableValue={props.moveListsHighlight.item}
          onChange={onChange}
        />
      </div>
    );
  }
);
