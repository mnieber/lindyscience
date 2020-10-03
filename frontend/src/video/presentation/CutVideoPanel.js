// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/session/facets/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import type { TagT } from 'src/tags/types';
import { CutPoints } from 'src/video/facets/CutPoints';
import { VideoPlayerPanel } from 'src/video/presentation/VideoPlayerPanel';
import { CutPointList } from 'src/video/presentation/CutPointList';

type PropsT = {
  moveTags: Array<TagT>,
  cutPoints: CutPoints,
  display: Display,
  moveDisplay: MoveDisplay,
};

export const CutVideoPanel: (PropsT) => any = observer((props: PropsT) => {
  const onKeyDown = (e) => {
    if (e.keyCode == 13) {
      props.cutPoints.setVideoLink(e.target.value);
    }
  };

  const linkPanel = (
    <div className="flexrow h-8">
      <input
        id="linkPanelInput"
        className="w-full"
        onKeyDown={onKeyDown}
        placeholder="Video link"
      />
    </div>
  );

  const videoPlayerPanel = (
    <VideoPlayerPanel
      key="videoPlayerPanel"
      videoController={props.cutPoints.videoController}
      display={props.display}
      moveDisplay={props.moveDisplay}
    />
  );

  const selectCutPointById = (id, isShift, isCtrl) => undefined;

  const cutPointList = (
    <CutPointList
      moveTags={props.moveTags}
      cutPoints={props.cutPoints}
      highlightedCutPoint={null}
      selectCutPointById={selectCutPointById}
    />
  );

  const buttonCreateMoves = (
    <div className="mt-4">
      <button
        className="button"
        onClick={() => {
          props.cutPoints.createMoves();
          props.cutPoints.remove(props.cutPoints.cutPoints.map((x) => x.id));
        }}
      >
        Create moves
      </button>
    </div>
  );
  return (
    <div>
      <h2 className="mt-4">Cut videos</h2>
      <div className={'cutVideoPanel panel'}>
        <p className="mb-2">
          This section is used for creating one or more new moves from a single
          video.
        </p>
        {linkPanel}
        {videoPlayerPanel}
        {buttonCreateMoves}
        {cutPointList}
      </div>
    </div>
  );
});