// @flow

import * as React from "react";
import classnames from "classnames";
import { Link } from "@reach/router";
import { RichTextEditor } from "rich_text/presentation/rich_text_editor";
import { toReadOnlyEditorState } from "rich_text/utils/editor_state";

import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";

// MoveListDetails

type MoveListTitlePropsT = {|
  moveList: MoveListT,
|};

export function MoveListTitle(props: MoveListTitlePropsT) {
  return (
    <div className="flex flex-row items-center">
      <Link className="" to={`/app/lists/${props.moveList.ownerUsername}`}>
        <h2>{props.moveList.ownerUsername}</h2>
      </Link>
      <h2>/</h2>
      <Link
        className=""
        to={`/app/lists/${props.moveList.ownerUsername}/${props.moveList.slug}`}
      >
        <h2>{props.moveList.name}</h2>
      </Link>
    </div>
  );
}

type MoveListDetailsPropsT = {|
  userProfile: UserProfileT,
  moveList: MoveListT,
|};

export function MoveListDetails(props: MoveListDetailsPropsT) {
  return (
    <div className={classnames("moveListDetails flex flex-col")}>
      <MoveListTitle moveList={props.moveList} />
      <RichTextEditor
        key={props.moveList.id}
        initialEditorState={toReadOnlyEditorState(props.moveList.description)}
        readOnly={true}
        autoFocus={false}
        setEditorRef={() => {}}
      />
    </div>
  );
}
