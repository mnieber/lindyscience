// @flow

import * as React from 'react'
import { MovePrivateDataForm } from 'moves/presentation/move_private_data_form'
import type { MovePrivateDataT } from 'moves/types'


type MovePrivateDatasPanelPropsT = {
  movePrivateData: ?MovePrivateDataT,
  onSave: () => void,
};

export function MovePrivateDataPanel(props: MovePrivateDatasPanelPropsT) {
  const [isEditing, setIsEditing] = React.useState(false);

  const editBtn =
    <div
      key={'edit'}
      className={"button button--wide ml-2"}
      onClick={() => setIsEditing(true)}
    >
    Edit
    </div>;

  const staticDiv =
    <div
      dangerouslySetInnerHTML={{
        __html: props.movePrivateData && props.movePrivateData.notes
      }}
    />

  const buttons = isEditing
    ? []
    : [editBtn];

  const formDiv =
    <MovePrivateDataForm
      autoFocus={true}
      onCancel={() => {setIsEditing(false);}}
      onSubmit={props.onSave}
      movePrivateData={props.movePrivateData}
    />;

  return (
    <div className={"move__privateNotes panel flexcol"}>
      <div className={"flexrow"}>
        <h2>Private notes</h2>
        {buttons}
      </div>
      {isEditing ? formDiv : staticDiv}
    </div>
  );
};
