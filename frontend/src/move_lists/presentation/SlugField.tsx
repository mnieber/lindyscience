import React from 'react';
import { TextField } from 'src/forms/components/TextField';
import { useFormStateContext } from 'react-form-state-context';
import { slugify } from 'src/utils/utils';
import { Field } from 'src/forms/components/Field';

const UpdateSlugBtn = ({ className }: { className: any }) => {
  const formState = useFormStateContext();

  return (
    <div
      className={className}
      onClick={() => {
        const newSlug = slugify(formState.values.name);
        if (newSlug) {
          formState.setValue('slug', newSlug);
        }
      }}
    >
      Update
    </div>
  );
};

export const SlugField = () => {
  return (
    <Field
      label="Slug"
      fieldName="slug"
      buttons={[
        <UpdateSlugBtn key="updateSlugBtn" className="button ml-2 flex-none" />,
      ]}
    >
      <TextField className="flex-1" disabled={true} controlled={true} />
    </Field>
  );
};
