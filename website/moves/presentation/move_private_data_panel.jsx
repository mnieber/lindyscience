// @flow

import * as React from "react";

import { MoveDescriptionEditor } from "moves/presentation/move_description_editor";
import { MovePrivateDataForm } from "moves/presentation/move_private_data_form";
import { Tags } from "tags/presentation/tags";

import type { UUID } from "kernel/types";
import type { MovePrivateDataT } from "moves/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";

type MovePrivateDatasPanelPropsT = {
  userProfile: UserProfileT,
  movePrivateData: ?MovePrivateDataT,
  onSave: (values: any) => void,
  moveTags: Array<TagT>,
  moveId: UUID,
  videoPlayer?: any,
};

export function MovePrivateDataPanel(props: MovePrivateDatasPanelPropsT) {
  const [isEditing, setIsEditing] = React.useState(false);

  const editBtn = (
    <div
      key={"edit"}
      className={"button button--wide ml-2"}
      onClick={() => setIsEditing(true)}
    >
      Edit
    </div>
  );

  const tags = (props.movePrivateData && props.movePrivateData.tags) || [];
  const id = (props.movePrivateData && props.movePrivateData.id) || undefined;

  const staticDiv = (
    <div>
      <MoveDescriptionEditor
        editorId={"privateData_" + props.moveId}
        description={props.movePrivateData ? props.movePrivateData.notes : ""}
        readOnly={true}
        autoFocus={false}
        videoPlayer={props.videoPlayer}
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
      onSubmit={values => {
        props.onSave(values);
        setIsEditing(false);
      }}
      moveId={props.moveId}
      videoPlayer={props.videoPlayer}
      movePrivateData={props.movePrivateData}
      knownTags={props.moveTags}
    />
  );

  return (
    <div className={"move__privateNotes panel flexcol"}>
      <div className={"flexrow"}>
        <h2>Private notes</h2>
        {buttons}
      </div>
      {isEditing ? formDiv : staticDiv}
    </div>
  );
}
