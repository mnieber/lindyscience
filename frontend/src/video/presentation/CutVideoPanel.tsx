import * as React from 'react';
import { observer } from 'mobx-react';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { TagsStore } from 'src/tags/TagsStore';
import { useDefaultProps, FC } from 'react-default-props-context';
import { VideoPlayerPanel } from 'src/video/presentation/VideoPlayerPanel';
import { CutPointList } from 'src/video/presentation/CutPointList';
import { MovesStore } from 'src/moves/MovesStore';

type PropsT = {};

type DefaultPropsT = {
  movesStore: MovesStore;
  tagsStore: TagsStore;
  cutPointsStore: CutPointsStore;
  videoController: VideoController;
};

export const CutVideoPanel: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const onKeyDown = (e: any) => {
      if (e.keyCode === 13) {
        props.cutPointsStore.setVideoLink(e.target.value);
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
        videoController={props.videoController}
      />
    );

    const buttonCreateMoves = (
      <div className="mt-4">
        <button
          className="button"
          onClick={() => {
            props.cutPointsStore.createMoves();
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
            This section is used for creating one or more new moves from a
            single video.
          </p>
          {linkPanel}
          {videoPlayerPanel}
          {buttonCreateMoves}
          <CutPointList />
        </div>
      </div>
    );
  }
);
