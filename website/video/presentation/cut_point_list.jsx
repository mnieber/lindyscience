// @flow

import * as React from "react";
import classnames from "classnames";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { VideoController } from "screens/move_container/facets/video_controller";
import { CutPointHeader } from "video/presentation/cut_point_header";
import { CutPointForm } from "video/presentation/cut_point_form";
import { handleSelectionKeys2, scrollIntoView, getId } from "app/utils";
import type { CutPointBvrsT, CutPointT } from "video/types";
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
          props.cutPoints.map(x => x.id),
          highlightedCutPointId,
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
  cutPointBvrs: CutPointBvrsT,
  videoCtr: VideoController,
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
    const form = (
      <CutPointForm
        cutPoint={cutPoint}
        onSubmit={props.cutPointBvrs.saveCutPoint}
        knownTags={props.moveTags}
        videoCtr={props.videoCtr}
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
          videoCtr={props.videoCtr}
          removeCutPoints={props.cutPointBvrs.removeCutPoints}
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
}
