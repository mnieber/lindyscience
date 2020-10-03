import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { UUID } from 'src/kernel/types';
import { CutPoints } from 'src/video/facets/CutPoints';
import { TagT } from 'src/tags/types';
import { CutPointT } from 'src/video/types';
import { getId, handleSelectionKeys2, scrollIntoView } from 'src/app/utils';
import { CutPointForm } from 'src/video/presentation/CutPointForm';
import { CutPointHeader } from 'src/video/presentation/CutPointHeader';

// CutPointList

type KeyHandlersT = {
  handleKeyDown: Function;
};

function createKeyHandlers(
  selectCutPointById: (UUID, boolean, boolean) => void,
  props: PropsT
): KeyHandlersT {
  function handleKeyDown(key, e) {
    if (props.highlightedCutPoint) {
      const highlightedCutPointId = props.highlightedCutPoint.id;
      e.target.id == 'cutPointList' &&
        handleSelectionKeys2(
          key,
          e,
          props.cutPoints.cutPoints.map((x) => x.id),
          highlightedCutPointId,
          (id) => selectCutPointById(id, false, false)
        );
    }
  }

  return {
    handleKeyDown,
  };
}

type ClickHandlersT = {
  handleMouseDown: Function;
  handleMouseUp: Function;
};

function createClickHandlers(
  selectCutPointById: (UUID, boolean, boolean) => void,
  props: PropsT
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

type PropsT = {
  cutPoints: CutPoints;
  moveTags: Array<TagT>;
  highlightedCutPoint?: CutPointT;
  selectCutPointById: (id: UUID, isShift: boolean, isCtrl: boolean) => void;
  className?: string;
};

export const CutPointList: React.FC<PropsT> = observer((props: PropsT) => {
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
        videoController={props.cutPoints.videoController}
        autoFocus={true}
      />
    );
    return (
      <div
        className={classnames({
          cutPointList__item: true,
          'cutPointList__item--highlighted':
            cutPoint.id == highlightedCutPointId,
        })}
        id={cutPoint.id}
        key={idx}
        onMouseDown={(e) => clickHandlers.handleMouseDown(e, cutPoint.id)}
        onMouseUp={(e) => clickHandlers.handleMouseUp(e, cutPoint.id)}
      >
        <CutPointHeader
          cutPoint={cutPoint}
          videoController={props.cutPoints.videoController}
          removeCutPoints={props.cutPoints.remove}
        />
        {cutPoint.type == 'start' && form}
      </div>
    );
  });

  return (
    <KeyboardEventHandler
      handleKeys={['up', 'down']}
      onKeyEvent={keyHandlers.handleKeyDown}
    >
      <div
        className={classnames(props.className, 'cutPointList')}
        tabIndex={123}
        id="cutPointList"
      >
        {cutPointNodes}
      </div>
    </KeyboardEventHandler>
  );
});
