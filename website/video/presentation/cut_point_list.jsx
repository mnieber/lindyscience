// @flow

import * as React from "react";
import classnames from "classnames";
import { Menu, MenuProvider } from "react-contexify";
import { handleSelectionKeys, scrollIntoView, getId } from "app/utils";
import KeyboardEventHandler from "react-keyboard-event-handler";

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
  const [swallowMouseUp: boolean, setSwallowMouseUp] = React.useState(false);

  function handleMouseDown(e, cutPointId) {
    selectCutPointById(cutPointId, e.shiftKey, e.ctrlKey);
    setSwallowMouseUp(true);
  }

  function handleMouseUp(e, cutPointId) {
    if (!swallowMouseUp) {
      selectCutPointById(cutPointId, e.shiftKey, e.ctrlKey);
    }
    setSwallowMouseUp(false);
  }

  return {
    handleMouseUp,
    handleMouseDown,
  };
}

type CutPointListPropsT = {|
  cutPoints: Array<CutPointT>,
  highlightedCutPoint: ?CutPointT,
  selectCutPointById: (id: UUID, isShift: boolean, isCtrl: boolean) => void,
  className?: string,
  refs: any,
|};

export function CutPointList(props: CutPointListPropsT) {
  props.refs.cutPointListRef = React.useRef(null);

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
        {cutPoint.title}
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
        ref={props.refs.cutPointListRef}
        tabIndex={123}
        id="cutPointList"
      >
        {cutPointNodes}
      </div>
    </KeyboardEventHandler>
  );
}
