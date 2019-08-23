// @flow

import * as React from "react";
import { MovePrivateDataForm } from "screens/presentation/move_private_data_form";
import { Tags } from "profiles/presentation/tags";
import type { MovePrivateDataT } from "screens/types";
import type { UserProfileT, TagT } from "profiles/types";

type MovePrivateDatasPanelPropsT = {
  userProfile: UserProfileT,
  movePrivateData: ?MovePrivateDataT,
  onSave: (values: any) => void,
  moveTags: Array<TagT>,
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

  const staticDiv = (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: props.movePrivateData && props.movePrivateData.notes,
        }}
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
