import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { ValuePicker } from 'src/utils/components/ValuePicker';
import { MoveListT } from 'src/movelists/types';
import { Addition } from 'skandha-facets/Addition';
import { Highlight } from 'skandha-facets/Highlight';
import { Selection } from 'skandha-facets/Selection';
import { useDefaultProps, FC } from 'react-default-props-context';
import { FormStateProvider, HandleSubmitArgsT } from 'react-form-state-context';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';

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

    const pickableValues = props.moveLists.filter(props.filter);
    const initialValues = {
      moveList:
        pickableValues.find(
          (x: MoveListT) => x.id === props.moveListsHighlight.id
        ) ?? null,
    };

    const handleSubmit = ({ values }: HandleSubmitArgsT) => {
      if (values.moveList.__isNew__) {
        props.moveListsAddition.add({ name: values.moveList.label });
      } else if (!!values.moveList) {
        props.moveListsSelection.selectItem({
          itemId: values.moveList.id,
        });
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
              labelFromValue={(x: MoveListT) => x.name}
              submitOnChange={true}
            />
          </div>
        </FormFieldContext>
      </FormStateProvider>
    );
  }
);
