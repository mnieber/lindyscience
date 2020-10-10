import React from 'react';

interface FormFieldContextT {
  fieldName: string;
  label: string | undefined;
}

const getNullFormFieldContext = (): FormFieldContextT => {
  return {
    fieldName: '',
    label: undefined,
  };
};

const FormFieldContext_ = React.createContext(getNullFormFieldContext());

export const FormFieldContext: React.FC<FormFieldContextT> = ({
  fieldName,
  label,
  children,
}) => {
  return (
    <FormFieldContext_.Provider value={{ fieldName, label }}>
      {children}
    </FormFieldContext_.Provider>
  );
};

export const useFormFieldContext = (): FormFieldContextT => {
  return React.useContext(FormFieldContext_);
};
