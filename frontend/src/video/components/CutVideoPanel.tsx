import * as React from 'react';
import { observer } from 'mobx-react';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { useDefaultProps, FC } from 'react-default-props-context';
import { VideoPlayerPanel } from 'src/video/components/VideoPlayerPanel';
import { CutPointList } from 'src/video/components/CutPointList';
import { useScheduledCall } from 'src/utils/useScheduledCall';
import { useStore } from 'src/app/components/StoreProvider';
import { MoveListT } from 'src/movelists/types';

type PropsT = {};

type DefaultPropsT = {
  moveList: MoveListT;
  videoController: VideoController;
};

export const CutVideoPanel: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);
    const { cutPointsStore, profilingStore } = useStore();
    const scheduleCreateMoves = useScheduledCall(() => {
      if (profilingStore.userProfile) {
        cutPointsStore.createMoves(props.moveList, profilingStore.userProfile);
      }
    });

    const onKeyDown = (e: any) => {
      if (e.keyCode === 13) {
        cutPointsStore.setVideoLink(e.target.value);
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
            scheduleCreateMoves();
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
