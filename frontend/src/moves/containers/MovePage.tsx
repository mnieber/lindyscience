import * as React from 'react';
import { observer } from 'mobx-react';

import { action } from 'mobx';
import { VideoPlayerPanel } from 'src/video/presentation/VideoPlayerPanel';
import { MovePrivateDataPanel } from 'src/moves/presentation/MovePrivateDataPanel';
import { MoveKeyHandlers } from 'src/moves/presentation/MoveKeyHandlers';
import { MoveHeader } from 'src/moves/presentation/MoveHeader';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { TipsPanel } from 'src/tips/presentation/TipsPanel';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveForm } from 'src/moves/presentation/MoveForm';
import { MoveListT } from 'src/move_lists/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { Move } from 'src/moves/presentation/Move';
import { Editing } from 'facility-mobx/facets/Editing';
import { useDefaultProps, FC } from 'react-default-props-context';
import { resetRS } from 'src/utils/RST';
import { ResourceView } from 'src/utils/ResourceView';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {};

type DefaultPropsT = {
  moveList: MoveListT;
  move: MoveT;
  moveDisplay: MoveDisplay;
  movesEditing: Editing;
  moveCtr: MoveContainer;
  videoController: VideoController;
  moveForm: any;
  moveKeyHandlers: any;
};

export const MovePage: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { tagsStore, moveListsStore, navigationStore } = useStore();

  const getRS = () => {
    const { moveListUrl } = navigationStore.dataRequest;
    return moveListUrl
      ? moveListsStore.moveListRSByUrl[moveListUrl] ?? resetRS()
      : resetRS();
  };

  const renderUpdated = () => {
    if (!props.move) {
      return <div>Oops, I cannot find this move</div>;
    }

    const _setAltLink = action((altLink: string | undefined) => {
      props.moveCtr.inputs.altLink = altLink;
    });

    const moveForm = (
      <MoveForm
        autoFocus={true}
        move={props.move}
        onSubmit={(values) => {
          _setAltLink(undefined);
          props.movesEditing.save(values);
        }}
        onCancel={() => {
          _setAltLink(undefined);
          props.movesEditing.cancel();
        }}
        knownTags={tagsStore.moveTags}
        videoController={props.videoController}
        setAltLink={_setAltLink}
      />
    );

    const moveDiv = props.movesEditing.isEditing ? (
      <React.Fragment>
        <VideoPlayerPanel />
        {moveForm}
      </React.Fragment>
    ) : (
      <React.Fragment>
        <MoveHeader />
        <VideoPlayerPanel />
        <Move move={props.move} videoController={props.videoController} />
        <MovePrivateDataPanel />
        <TipsPanel />
      </React.Fragment>
    );

    return (
      <MoveKeyHandlers>
        <div id={props.moveDisplay.rootDivId} tabIndex={123}>
          {moveDiv}
        </div>
      </MoveKeyHandlers>
    );
  };

  return (
    <ResourceView
      rs={getRS()}
      renderUpdating={() => <div>Loading move list, please wait...</div>}
      renderErrored={() => <div>Oops, I cannot find this move list</div>}
      renderUpdated={renderUpdated}
    />
  );
});
