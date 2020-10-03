import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import { UserProfileT } from 'src/profiles/types';
import { MovePrivateDataT } from 'src/moves/types';
import { TagT } from 'src/tags/types';
import { UUID } from 'src/kernel/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { Tags } from 'src/tags/presentation/Tags';
import { MovePrivateDataForm } from 'src/moves/presentation/MovePrivateDataForm';

type PropsT = {
  userProfile: UserProfileT;
  movePrivateData?: MovePrivateDataT;
  onSave: (values: any) => void;
  moveTags: Array<TagT>;
  moveId: UUID;
  videoController?: VideoController;
};

export const MovePrivateDataPanel = (props: PropsT) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const editBtn = (
    <FontAwesomeIcon
      key={'edit'}
      className="ml-2"
      icon={faEdit}
      onClick={() => setIsEditing(true)}
    />
  );

  const tags = (props.movePrivateData && props.movePrivateData.tags) || [];

  const staticDiv = (
    <div>
      <MoveDescriptionEditor
        editorId={'privateData_' + props.moveId}
        description={props.movePrivateData ? props.movePrivateData.notes : ''}
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
        props.onSave(values);
        setIsEditing(false);
      }}
      moveId={props.moveId}
      videoController={props.videoController}
      movePrivateData={props.movePrivateData}
      knownTags={props.moveTags}
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
