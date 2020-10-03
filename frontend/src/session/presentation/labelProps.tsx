type PropsT = {
  fieldName: string;
  label: string;
};

export const labelProps = ({ fieldName, label }: PropsT) => {
  return {
    label,
    fieldName,
  };
};
