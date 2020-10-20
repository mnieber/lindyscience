import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { ValuePicker, NewPickerValue } from 'src/utils/value_picker';
import { MoveListT } from 'src/move_lists/types';
import { Addition } from 'facet-mobx/facets/addition';
import { Highlight } from 'facet-mobx/facets/highlight';
import { Selection } from 'facet-mobx/facets/selection';
import { mergeDefaultProps, FC } from 'react-default-props-context';
import { FormStateProvider, HandleSubmitArgsT } from 'react-form-state-context';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';

type PropsT = {
  filter: (moveList: MoveListT) => boolean;
  className?: string;
  navigateTo: (moveList: MoveListT) => any;
};

type DefaultPropsT = {
  moveListsAddition: Addition;
  moveListsHighlight: Highlight;
  moveListsSelection: Selection;
  moveLists: Array<MoveListT>;
};

export const MoveListPicker: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = mergeDefaultProps<PropsT, DefaultPropsT>(p);

    const pickableValues = props.moveLists.filter(props.filter);
    const initialValues = {
      moveList:
        pickableValues.find((x) => x.id === props.moveListsHighlight.id) ??
        null,
    };

    const handleSubmit = ({ values }: HandleSubmitArgsT) => {
      if (values.moveList instanceof NewPickerValue) {
        props.moveListsAddition.add({ name: values.moveList.label });
        props.navigateTo(props.moveListsAddition.item);
      } else if (!!values.moveList) {
        props.moveListsSelection.selectItem({
          itemId: values.moveList.id,
        });
        props.navigateTo(props.moveListsHighlight.item);
      }
    };

    return (
      <FormStateProvider
        initialValues={initialValues}
        handleSubmit={handleSubmit}
      >
        <FormFieldContext
          fieldName="moveList"
          label=""
          placeholder="Select a move list"
        >
          <div className={classnames('moveListPicker mt-2', props.className)}>
            <ValuePicker
              isMulti={false}
              isCreatable={true}
              pickableValues={pickableValues}
              labelFromValue={(x) => x.name}
              submitOnChange={true}
            />
          </div>
        </FormFieldContext>
      </FormStateProvider>
    );
  }
);
