import React from 'react';
import { useFormStateContext } from 'react-form-state-context';
import { slugify } from 'src/utils/utils';

export const UpdateSlugBtn = ({ className }: { className: any }) => {
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
