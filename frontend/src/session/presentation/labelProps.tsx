import { useFormStateContext } from 'src/session/presentation/FormStateProvider';

type FieldT = 'checkbox' | 'textfield';

type PropsT = {
  fieldName: string,
  label: string,
};

export const labelProps = ({ fieldName, label }: PropsT) => {
  return {
    label,
    fieldName,
  };
};
