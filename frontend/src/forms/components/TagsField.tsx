import React from 'react';
import { Field } from 'src/forms/components';
import { ValuePicker } from 'src/utils/components/ValuePicker';
import { TagT } from 'src/tags/types';

interface PropsT {
  knownTags: TagT[];
}

export const TagsField: React.FC<PropsT> = (props: PropsT) => {
  return (
    <Field fieldName="tags" label="Tags">
      <div className="moveListForm__tags">
        <ValuePicker
          zIndex={10}
          isCreatable={true}
          isMulti={true}
          pickableValues={props.knownTags}
          labelFromValue={(x) => x}
        />
      </div>
    </Field>
  );
};
