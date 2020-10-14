import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { ValuePicker } from 'src/utils/value_picker';
import { MoveListT } from 'src/move_lists/types';
import { Addition } from 'facet-mobx/facets/addition';
import { Highlight } from 'facet-mobx/facets/highlight';
import { Selection } from 'facet-mobx/facets/selection';
import { mergeDefaultProps } from 'react-default-props-context';
import { FormStateProvider, HandleSubmitArgsT } from 'react-form-state-context';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';

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

export const MoveListPicker: React.FC<PropsT> = observer((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  function toPickerValue(moveList: MoveListT) {
    return {
      value: moveList.id,
      label: moveList.name,
    };
  }

  const options = props.moveLists.filter(props.filter).map(toPickerValue);
  const initialValues = {
    moveListPV: options.find((x) => x.value === props.moveListsHighlight.id) ?? null,
  };

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    if (options.includes(values.moveListPV)) {
      props.moveListsSelection.selectItem({
        itemId: values.moveListPV.value,
        isShift: false,
        isCtrl: false,
      });
      props.navigateTo(props.moveListsHighlight.item);
    }
    else if (values.moveListPV) {
      props.moveListsAddition.add({ name: values.moveListPV.label });
      props.navigateTo(props.moveListsAddition.item);
    }
  };

  return (
    <FormStateProvider
      initialValues={initialValues}
      handleSubmit={handleSubmit}
    >
      <FormFieldContext
        fieldName="moveListPV"
        label=""
        placeholder="Select a move list"
      >
        <div className={classnames('moveListPicker mt-2', props.className)}>
          <ValuePicker
            isMulti={false}
            isCreatable={true}
            options={options}
            submitOnChange={true}
          />
        </div>
      </FormFieldContext>
    </FormStateProvider>
  );
});
