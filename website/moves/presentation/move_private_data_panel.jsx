// @flow

import * as React from "react";
import { MovePrivateDataForm } from "moves/presentation/move_private_data_form";
import { Tags } from "tags/presentation/tags";
import { RichTextEditor } from "rich_text/presentation/rich_text_editor";
import { toReadOnlyEditorState } from "rich_text/utils/editor_state";

import type { MovePrivateDataT } from "moves/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";

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
  const id = (props.movePrivateData && props.movePrivateData.id) || undefined;

  const staticDiv = (
    <div>
      <RichTextEditor
        key={id}
        initialEditorState={toReadOnlyEditorState(
          props.movePrivateData ? props.movePrivateData.notes : ""
        )}
        readOnly={true}
        autoFocus={false}
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
