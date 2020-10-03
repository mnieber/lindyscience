type FieldT = 'checkbox' | 'textfield';

export const formFieldProps = (
  formState: any,
  { fieldName, ...otherProps }: any,
  fieldType?: FieldT
) => {
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
