import React from 'react';
import { TextField } from 'src/forms/components/TextField';
import { useFormStateContext } from 'react-form-state-context';
import { slugify } from 'src/utils/utils';

const UpdateSlugBtn = ({ className }: { className: any }) => {
  const formState = useFormStateContext();
  return (
    <div
      key="updateSlugBtn"
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
    <TextField
      classNames="flex-1"
      disabled={true}
      buttons={[<UpdateSlugBtn className="button ml-2 flex-none" />]}
    />
  );
};
