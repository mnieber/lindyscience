import * as React from 'react';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import { TagsStore } from 'src/tags/TagsStore';
import { MovePrivateDataT, MoveT } from 'src/moves/types';
import { useDefaultProps, FC } from 'react-default-props-context';
import { UserProfileT } from 'src/profiles/types';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { Tags } from 'src/tags/presentation/Tags';
import { MovePrivateDataForm } from 'src/moves/presentation/MovePrivateDataForm';
import { EditingPrivateData } from 'src/moves/MovesCtr/facets/EditingPrivateData';
import { MovesStore } from 'src/moves/MovesStore';

type DefaultPropsT = {
  move: MoveT;
  userProfile: UserProfileT;
  movesStore: MovesStore;
  tagsStore: TagsStore;
  movesEditingPD: EditingPrivateData;
  videoController?: any;
  movePrivateData: MovePrivateDataT;
};

type PropsT = {};

export const MovePrivateDataPanel: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const editBtn = (
      <FontAwesomeIcon
        key={'edit'}
        className="ml-2 text-lg"
        icon={faEdit}
        onClick={() => props.movesEditingPD.enable()}
      />
    );

    const tags = props.movePrivateData?.tags ?? [];

    const staticDiv = (
      <div>
        <MoveDescriptionEditor
          key={props.movePrivateData?.notes}
          editorId={'privateData_' + props.move.id}
          description={props.movePrivateData?.notes ?? ''}
          readOnly={true}
          autoFocus={false}
          videoController={props.videoController}
        />
        {tags.length ? <Tags tags={tags} /> : undefined}
      </div>
    );

    const buttons =
      props.movesEditingPD.isEditing || !props.userProfile ? [] : [editBtn];

    const formDiv = (
      <MovePrivateDataForm
        autoFocus={true}
        onCancel={() => props.movesEditingPD.cancel()}
        onSubmit={(values) => {
          props.movesEditingPD.save(values);
        }}
        moveId={props.move.id}
        videoController={props.videoController}
        movePrivateData={props.movePrivateData}
        knownTags={props.tagsStore.moveTags}
      />
    );

    return (
      <div className={'move__privateNotes panel flexcol'}>
        <div className={'flexrow items-center'}>
          <h2 className="text-xl font-semibold">Private notes</h2>
          {buttons}
        </div>
        {props.movesEditingPD.isEditing ? formDiv : staticDiv}
      </div>
    );
  }
);
