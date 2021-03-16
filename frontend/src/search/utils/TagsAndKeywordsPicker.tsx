import React from 'react';
import * as _ from 'lodash/fp';
import { observer } from 'mobx-react';

import {
  FormStateProvider,
  HandleSubmitArgsT,
  useFormStateContext,
} from 'react-form-state-context';
import { useMobXState } from 'src/forms/components/MobXFormState';
import { ValuePicker } from 'src/utils/components/ValuePicker';
import { TagT } from 'src/tags/types';
import { isNone } from 'src/utils/utils';
import { Field } from 'src/forms/components/Field';

const _cache: { [input: string]: any } = {};

function _getSearchInput(input: string) {
  let result = _cache[input];
  if (!isNone(result)) {
    return result;
  }

  const words = input.split(' ');
  words.forEach((word) => {
    if (word.startsWith(':')) {
      result = word.slice(1);
    }
  });

  _cache[input] = result;
  return result;
}

const _filterOption = (candidate: any, input: string) => {
  const searchInput = _getSearchInput(input);
  return (
    !isNone(searchInput) &&
    (searchInput === '' || candidate.label.includes(searchInput))
  );
};

type PropsT = {
  onChange?: Function;
  knownTags?: TagT[];
  placeholder?: string;
  zIndex?: number;
};

export const TagsAndKeywordsPicker = observer((props: PropsT) => {
  const tags = _.map((x) => ':' + x, props.knownTags ?? []);

  const Picker = observer(() => {
    const formState = useFormStateContext();

    const onInputChange = (inputValue: any, { action }: any) => {
      if (action === 'input-change') {
        const terms = _.split(' ')(inputValue);
        const keywords = _.filter((x) => !x.startsWith(':'), terms);

        formState.setValue('keywords', keywords);
        formState.setValue('inputValue', inputValue);
        formState.setValue(
          'isEditingTag',
          terms.length > 0 && terms[terms.length - 1].startsWith(':')
        );
      } else if (action === 'set-value') {
        const newInputValue = _.join(' ')(formState.values.keywords);
        formState.setValue('inputValue', newInputValue);
      }
    };

    return (
      <ValuePicker
        zIndex={10}
        isCreatable={false}
        isMulti={true}
        pickableValues={tags}
        labelFromValue={(x: string) => x}
        filterOption={_filterOption}
        noOptionsMessage={() => null}
        onInputChange={onInputChange}
        tabOnEnter={false}
        inputValue={formState.values.inputValue}
        submitOnChange={false}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13 && !formState.values.isEditingTag) {
            formState.submit();
          }
        }}
      />
    );
  });

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    if (props.onChange) {
      props.onChange({
        tags: (values.tags ?? []).map((x: string) => x.slice(1)),
        keywords: values.keywords ?? [],
      });
    }
  };

  return (
    <FormStateProvider
      initialValues={{
        tags: [],
        keywords: [],
        inputValue: '',
        isEditingTag: false,
      }}
      handleSubmit={handleSubmit}
      createState={useMobXState}
    >
      <Field fieldName="tags" label="">
        <div style={{ zIndex: props.zIndex }}>
          <Picker />
        </div>
      </Field>
    </FormStateProvider>
  );
});
