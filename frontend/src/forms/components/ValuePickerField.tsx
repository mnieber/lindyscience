import { observer } from 'mobx-react';
import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';
import { useScheduledCall } from 'src/utils/useScheduledCall';
import { PickerValueT, ValuePicker } from 'src/utils/components/ValuePicker';

type PropsT<ValueT> = {
  isMulti: boolean;
  isCreatable: boolean;
  pickableValues: ValueT[];
  submitOnChange?: boolean;
  labelFromValue: (value: any) => string;
  [k: string]: any;
};

export const ValuePickerField = observer(<ValueT,>(props: PropsT<ValueT>) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();
  const formValue = formState.values[fieldContext.fieldName];
  const scheduleSubmit = useScheduledCall(formState.submit);

  const saveChanges = (value: any, { action }: any) => {
    const toPickableValue = (value: PickerValueT) => {
      return value.__isNew__ ? value : value.value;
    };

    const pickableValue = props.isMulti
      ? (value || []).map(toPickableValue)
      : toPickableValue(value);

    formState.setValue(fieldContext.fieldName, pickableValue);
    if (props.submitOnChange) {
      scheduleSubmit();
    }
  };

  return (
    <ValuePicker
      {...props}
      name={fieldContext.fieldName}
      placeholder={fieldContext.label}
      pickableValue={formValue}
      onChange={saveChanges}
    ></ValuePicker>
  );
});
