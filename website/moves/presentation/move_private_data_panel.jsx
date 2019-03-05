// @flow

import * as React from 'react'
import { MovePrivateDataForm } from 'moves/presentation/move_private_data_form'
import type { MovePrivateDataT } from 'moves/types'


type MovePrivateDatasPanelPropsT = {
  movePrivateData: ?MovePrivateDataT,
  onSave: Function,
};

export function MovePrivateDataPanel(props: MovePrivateDatasPanelPropsT) {
  const [isEditing, setIsEditing] = React.useState(false);

  const editBtn =
    <div
      className={"button button--wide ml-2"}
      onClick={() => setIsEditing(true)}
    >
    Edit
    </div>;

  const staticDiv =
    <div>
      {editBtn}
      <div
        dangerouslySetInnerHTML={{
          __html: props.movePrivateData && props.movePrivateData.notes
        }}
      />
    </div>;

  const formDiv =
    <MovePrivateDataForm
      autoFocus={true}
      onCancel={() => {setIsEditing(false);}}
      onSubmit={props.onSave}
      movePrivateData={props.movePrivateData}
    />;

  return (
    <div className={"move__privateNotes panel"}>
    <h2>Private notes</h2>
    {isEditing ? formDiv : staticDiv}
    </div>
  );
};
