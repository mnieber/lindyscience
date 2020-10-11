import React from 'react';

interface FormFieldContextT {
  fieldName: string;
  label: string | undefined;
  placeholder?: string;
}

const getNullFormFieldContext = (): FormFieldContextT => {
  return {
    fieldName: '',
    label: undefined,
    placeholder: undefined,
  };
};

const Context = React.createContext(getNullFormFieldContext());

export const FormFieldContext: React.FC<FormFieldContextT> = ({
  fieldName,
  label,
  placeholder,
  children,
}) => {
  return (
    <Context.Provider value={{ fieldName, label, placeholder }}>
      {children}
    </Context.Provider>
  );
};

export const useFormFieldContext = (): FormFieldContextT => {
  return React.useContext(Context);
};
