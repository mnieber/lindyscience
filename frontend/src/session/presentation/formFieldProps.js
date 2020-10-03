import { useFormStateContext } from 'src/session/presentation/FormStateProvider';

type FieldT = 'checkbox' | 'textfield';

export const formFieldProps = (
  { fieldName, ...otherProps }: any,
  fieldType: ?FieldT
) => {
  const formState = useFormStateContext();

  return {
    ...otherProps,
    ...(fieldType === 'checkbox'
      ? {
          checked: formState.values[fieldName],
          type: 'checkbox',
        }
      : {
          defaultValue: formState.values[fieldName],
        }),
    name: fieldName,
    onChange: (e: any) => {
      formState.setValue(fieldName, e.target.value);
    },
    onBlur: (e: any) => {
      // formState.setError(fieldName, `This field is required ${fieldName}`);
    },
  };
};
