import React from 'react';
import { TextField } from 'src/forms/components/TextField';
import { FormFieldLabel } from 'src/utils/form_utils';
import { UpdateSlugBtn } from 'src/move_lists/presentation/UpdateSlugBtn';

export const SlugField = () => (
  <FormFieldLabel label="Slug" fieldName="slug">
    <TextField
      fieldName="name"
      classNames="flex-1"
      placeholder="Slug"
      disabled={true}
      buttons={[<UpdateSlugBtn className="button ml-2 flex-none" />]}
    />
  </FormFieldLabel>
);
