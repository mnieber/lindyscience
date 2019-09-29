// @flow

import * as React from "react";
import classnames from "classnames";
import { Menu, MenuProvider } from "react-contexify";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { CutPointForm } from "video/presentation/cut_point_form";
import { handleSelectionKeys, scrollIntoView, getId } from "app/utils";

import type { TagT } from "tags/types";
import type { CutPointT } from "video/types";
import type { UUID } from "kernel/types";

// CutPointList

type KeyHandlersT = {|
  handleKeyDown: Function,
|};

function createKeyHandlers(
  selectCutPointById: (UUID, boolean, boolean) => void,
  props: CutPointListPropsT
): KeyHandlersT {
  function handleKeyDown(key, e) {
    if (props.highlightedCutPoint) {
      e.target.id == "cutPointList" &&
        handleSelectionKeys(
          key,
          e,
          props.cutPoints,
          props.highlightedCutPoint.id,
          // TODO support shift selection with keyboard (e.shiftKey)
          // Note: in that case, anchor != highlight
          id => selectCutPointById(id, false, false)
        );
    }
  }

  return {
    handleKeyDown,
  };
}

type ClickHandlersT = {|
  handleMouseDown: Function,
  handleMouseUp: Function,
|};

function createClickHandlers(
  selectCutPointById: (UUID, boolean, boolean) => void,
  props: CutPointListPropsT
): ClickHandlersT {
  function handleMouseDown(e, cutPointId) {
    selectCutPointById(cutPointId, e.shiftKey, e.ctrlKey);
  }

  function handleMouseUp(e, cutPointId) {}

  return {
    handleMouseUp,
    handleMouseDown,
  };
}

type CutPointListPropsT = {|
  cutPoints: Array<CutPointT>,
  moveTags: Array<TagT>,
  highlightedCutPoint: ?CutPointT,
  selectCutPointById: (id: UUID, isShift: boolean, isCtrl: boolean) => void,
  videoPlayer: any,
  className?: string,
|};

export function CutPointList(props: CutPointListPropsT) {
  const selectCutPointById = (
    cutPointId: UUID,
    isShift: boolean,
    isCtrl: boolean
  ) => {
    scrollIntoView(document.getElementById(cutPointId));
    props.selectCutPointById(cutPointId, isShift, isCtrl);
  };

  const keyHandlers = createKeyHandlers(selectCutPointById, props);
  const clickHandlers = createClickHandlers(selectCutPointById, props);
  const highlightedCutPointId = getId(props.highlightedCutPoint);

  const cutPointNodes = props.cutPoints.map((cutPoint, idx) => {
    const foo = { tags: [] };
    return (
      <div
        className={classnames({
          cutPointList__item: true,
          "cutPointList__item--highlighted":
            cutPoint.id == highlightedCutPointId,
        })}
        id={cutPoint.id}
        key={idx}
        onMouseDown={e => clickHandlers.handleMouseDown(e, cutPoint.id)}
        onMouseUp={e => clickHandlers.handleMouseUp(e, cutPoint.id)}
      >
        <CutPointForm
          cutPoint={cutPoint}
          onSubmit={() => {}}
          knownTags={props.moveTags}
          videoPlayer={props.videoPlayer}
        />
      </div>
    );
  });

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down"]}
      onKeyEvent={keyHandlers.handleKeyDown}
    >
      <div
        className={classnames(props.className, "cutPointList")}
        tabIndex={123}
        id="cutPointList"
      >
        {cutPointNodes}
      </div>
    </KeyboardEventHandler>
  );
}
