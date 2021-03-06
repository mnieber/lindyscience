import * as React from 'react';
import { observer } from 'mobx-react';

import { action } from 'mobx';
import { VideoPlayerPanel } from 'src/video/components/VideoPlayerPanel';
import { MovePrivateDataPanel } from 'src/moves/components/MovePrivateDataPanel';
import { MoveKeyHandlers } from 'src/moves/components/MoveKeyHandlers';
import { MoveHeader } from 'src/moves/components/MoveHeader';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { TipsPanel } from 'src/tips/components/TipsPanel';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveForm } from 'src/moves/components/MoveForm';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { Move } from 'src/moves/components/Move';
import { Editing } from 'skandha-facets/Editing';
import { Selection } from 'skandha-facets/Selection';
import { useDefaultProps, FC } from 'react-default-props-context';
import { resetRS } from 'src/utils/RST';
import { ResourceView } from 'src/utils/components/ResourceView';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {};

type DefaultPropsT = {
  move: MoveT;
  moveDisplay: MoveDisplay;
  movesEditing: Editing;
  movesSelection: Selection;
  moveCtr: MoveContainer;
  videoController: VideoController;
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
      return (props.movesSelection.selectableIds ?? []).length > 0 ? (
        <div>Oops, I cannot find this move</div>
      ) : (
        <React.Fragment />
      );
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
