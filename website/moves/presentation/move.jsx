// @flow

import * as React from "react";
import classnames from "classnames";

import { MoveListTitle } from "moves/presentation/move_list_details";
import { RichTextEditor } from "moves/presentation/rich_text_editor";

import type { MoveT, MoveListT } from "moves/types";
import type { TagT } from "app/types";

export function Tags({ tags }: { tags: Array<TagT> }) {
  const items = tags.map((tagName, idx) => {
    return (
      <div key={idx} className="move__tag">
        {tagName}
      </div>
    );
  });

  return <div className={"move__tags"}>{items}</div>;
}

// Move

type MovePropsT = {
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  buttons?: Array<React.Node>,
  className?: string,
  tipsPanel: any,
  videoLinksPanel: any,
  movePrivateDataPanel: any,
};

export function Move(props: MovePropsT) {
  const nameDiv = (
    <div className="flex flex-row items-center">
      <MoveListTitle moveList={props.moveList} />
      <h2>:</h2>
      <div className={"move__name flexrow flex-wrap ml-2"}>
        <h1>{props.move.name}</h1>
        {props.buttons}
      </div>
    </div>
  );

  const tagsDiv = props.move.tags.length ? (
    <Tags tags={props.move.tags} />
  ) : (
    undefined
  );

  const descriptionDiv = (
    <div className={"move__description panel"}>
      <h2>Description</h2>
      <RichTextEditor
        key={props.move.id}
        content={props.move.description}
        readOnly={true}
        autoFocus={false}
        setEditorRef={() => {}}
      />
    </div>
  );

  return (
    <div className={classnames("move", props.className || "")}>
      {nameDiv}
      {tagsDiv}
      {descriptionDiv}
      {props.movePrivateDataPanel}
      {props.tipsPanel}
      {props.videoLinksPanel}
    </div>
  );
}
