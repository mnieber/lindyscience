import React from 'react';

interface FormFieldContextT {
  name: string | undefined;
  label: string | undefined;
}

const getNullFormFieldContext = (): FormFieldContextT => {
  return {
    name: undefined,
    label: undefined,
  };
};

const FormFieldContext_ = React.createContext(getNullFormFieldContext());

export const FormFieldContext: React.FC<FormFieldContextT> = ({
  name,
  label,
  children,
}) => {
  return (
    <FormFieldContext_.Provider value={{ name, label }}>
      {children}
    </FormFieldContext_.Provider>
  );
};

export const useFormFieldContext = (): FormFieldContextT => {
  return React.useContext(FormFieldContext_);
};
