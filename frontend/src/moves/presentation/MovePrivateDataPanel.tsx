import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { keys } from 'lodash/fp';

import { UserProfileT } from 'src/profiles/types';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { Tags } from 'src/tags/presentation/Tags';
import { MovePrivateDataForm } from 'src/moves/presentation/MovePrivateDataForm';
import { useDefaultProps } from 'react-default-props-context';
import { MovesEditing } from 'src/moves/MovesCtr/facets/MovesEditing';
import { MoveT } from 'src/moves/types';
import { MovesStore } from 'src/moves/MovesStore';

type PropsT = {};

type DefaultPropsT = {
  move: MoveT;
  userProfile: UserProfileT;
  movesStore: MovesStore;
  movesEditing: MovesEditing;
  videoController?: any;
};

export const MovePrivateDataPanel = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const [isEditing, setIsEditing] = React.useState(false);

  const movePrivateData = props.movesStore.getOrCreatePrivateData(
    props.move.id
  );

  const editBtn = (
    <FontAwesomeIcon
      key={'edit'}
      className="ml-2 text-lg"
      icon={faEdit}
      onClick={() => setIsEditing(true)}
    />
  );

  const tags = movePrivateData?.tags ?? [];

  const staticDiv = (
    <div>
      <MoveDescriptionEditor
        key={movePrivateData?.notes}
        editorId={'privateData_' + props.move.id}
        description={movePrivateData?.notes ?? ''}
        readOnly={true}
        autoFocus={false}
        videoController={props.videoController}
      />
      {tags.length ? <Tags tags={tags} /> : undefined}
    </div>
  );

  const buttons = isEditing || !props.userProfile ? [] : [editBtn];

  const formDiv = (
    <MovePrivateDataForm
      autoFocus={true}
      onCancel={() => {
        setIsEditing(false);
      }}
      onSubmit={(values) => {
        props.movesEditing.savePrivateData(values);
        setIsEditing(false);
      }}
      moveId={props.move.id}
      videoController={props.videoController}
      movePrivateData={movePrivateData}
      knownTags={keys(props.movesStore.tags)}
    />
  );

  return (
    <div className={'move__privateNotes panel flexcol'}>
      <div className={'flexrow items-center'}>
        <h2 className="text-xl font-semibold">Private notes</h2>
        {buttons}
      </div>
      {isEditing ? formDiv : staticDiv}
    </div>
  );
};
