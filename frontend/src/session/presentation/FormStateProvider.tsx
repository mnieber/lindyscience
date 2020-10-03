import React from 'react';
import { observer } from 'mobx-react';

// $FlowFixMe
export const FormStateContext = React.createContext({
  values: {},
  errors: {},
});

const useFormState = (initialValues: any, externalErrors: any) => {
  const [formState, setFormState] = React.useState({
    values: initialValues || {},
    errors: {},
  });

  const setValue = (key: string, value: any) => {
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [key]: value,
      },
    });
  };

  const setError = (key: string, error: any) => {
    setFormState({
      ...formState,
      errors: {
        ...formState.errors,
        [key]: error,
      },
    });
  };

  return {
    values: formState.values,
    errors: {
      ...formState.errors,
      ...externalErrors,
    },
    setValue,
    setError,
  };
};

type PropsT = {
  children: any;
  initialValues?: any;
  externalErrors?: {};
};

export const FormStateProvider = observer((props: PropsT) => {
  const formState = useFormState(props.initialValues, props.externalErrors);

  return (
    <FormStateContext.Provider value={formState}>
      {props.children}
    </FormStateContext.Provider>
  );
});

export const useFormStateContext = (): any => {
  return React.useContext(FormStateContext);
};
