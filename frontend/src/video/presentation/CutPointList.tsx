import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { Editing } from 'facility-facets/Editing';
import { Deletion } from 'facility-facets/Deletion';
import { useDefaultProps, FC } from 'react-default-props-context';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { CutPointT } from 'src/video/types';
import { CutPointForm } from 'src/video/presentation/CutPointForm';
import { CutPointHeader } from 'src/video/presentation/CutPointHeader';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {};

type DefaultPropsT = {
  cutPoints: CutPointT[];
  cutPointsEditing: Editing;
  cutPointsDeletion: Deletion;
  videoController: VideoController;
};

export const CutPointList: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { tagsStore } = useStore();

  const cutPointNodes = props.cutPoints.map((cutPoint: CutPointT) => {
    const form = (
      <CutPointForm
        cutPoint={cutPoint}
        onSubmit={props.cutPointsEditing.save}
        knownTags={tagsStore.moveTags}
        videoController={props.videoController}
        autoFocus={true}
      />
    );
    return (
      <div
        key={cutPoint.id}
        className={classnames({
          cutPointList__item: true,
        })}
        id={cutPoint.id}
      >
        <CutPointHeader
          cutPoint={cutPoint}
          videoController={props.videoController}
          removeCutPoints={props.cutPointsDeletion.delete}
        />
        {cutPoint.type === 'start' && form}
      </div>
    );
  });

  return (
    <div
      className={classnames('cutPointList')}
      tabIndex={123}
      id="cutPointList"
    >
      {cutPointNodes}
    </div>
  );
});
