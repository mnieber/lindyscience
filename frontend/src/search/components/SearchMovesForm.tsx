import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useFormStateContext } from 'react-form-state-context';
import { Display as SessionDisplay } from 'src/app/Display';
import { TagT } from 'src/tags/types';
import { useDefaultProps, FC } from 'react-default-props-context';
import { TagsAndKeywordsPicker } from 'src/search/utils/TagsAndKeywordsPicker';

import './SearchMovesForm.scss';

type PropsT = {
  onSubmit: (values: any) => any;
  knownTags: Array<TagT>;
  autoFocus: boolean;
  latestOptions: any;
};

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
};

export const SearchMovesForm: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    function _onPickerChange({
      tags,
      keywords,
    }: {
      tags: string[];
      keywords: string[];
    }) {
      props.onSubmit({
        keywords,
        tags,
      });
    }

    const placeholder = props.sessionDisplay.small
      ? 'Search moves'
      : 'Search moves by :tags, keywords and user:me';

    const tagsAndKeywordsField = (
      <div className="moveForm__tags mt-2 ml-2 w-full">
        <TagsAndKeywordsPicker
          knownTags={props.knownTags}
          placeholder={placeholder}
          zIndex={10}
          onChange={_onPickerChange}
        />
      </div>
    );

    const SearchBtn = () => {
      const formState = useFormStateContext();
      return (
        <FontAwesomeIcon
          key={1}
          className="ml-4"
          icon={faSearch}
          size="lg"
          onClick={() => {
            formState.submit();
          }}
        />
      );
    };

    return (
      <div className={'SearchMovesField flexrow items-center'}>
        {tagsAndKeywordsField}
        <div className={'moveForm__buttonPanel flexrow mt-4'}>
          <SearchBtn />
        </div>
      </div>
    );
  }
);
