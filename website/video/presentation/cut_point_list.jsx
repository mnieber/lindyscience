// @flow

import * as React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { CutPoints } from "screens/cut_video_container/facets/cut_points";
import { CutPointHeader } from "video/presentation/cut_point_header";
import { CutPointForm } from "video/presentation/cut_point_form";
import { handleSelectionKeys2, scrollIntoView, getId } from "app/utils";
import type { CutPointT } from "video/types";
import type { TagT } from "tags/types";
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
      const highlightedCutPointId = props.highlightedCutPoint.id;
      e.target.id == "cutPointList" &&
        handleSelectionKeys2(
          key,
          e,
          props.cutPoints.cutPoints.map(x => x.id),
          highlightedCutPointId,
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
  cutPoints: CutPoints,
  moveTags: Array<TagT>,
  highlightedCutPoint: ?CutPointT,
  selectCutPointById: (id: UUID, isShift: boolean, isCtrl: boolean) => void,
  className?: string,
|};

export const CutPointList = observer((props: CutPointListPropsT) => {
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

  const cutPointNodes = props.cutPoints.cutPoints.map((cutPoint, idx) => {
    const form = (
      <CutPointForm
        cutPoint={cutPoint}
        onSubmit={props.cutPoints.save}
        knownTags={props.moveTags}
        videoCtr={props.cutPoints.videoCtr}
        autoFocus={true}
      />
    );
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
        <CutPointHeader
          cutPoint={cutPoint}
          videoCtr={props.cutPoints.videoCtr}
          removeCutPoints={props.cutPoints.remove}
        />
        {cutPoint.type == "start" && form}
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
});
