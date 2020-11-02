import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { keys } from 'lodash/fp';

import { MoveListForm } from 'src/move_lists/presentation/MoveListForm';
import { MoveListDetails } from 'src/move_lists/presentation/MoveListDetails';
import { MovesStore } from 'src/moves/MovesStore';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Display } from 'src/session/facets/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { Profiling } from 'src/session/facets/Profiling';
import { MoveListT } from 'src/move_lists/types';
import { Editing } from 'facet-mobx/facets/Editing';
import { UserProfileT } from 'src/profiles/types';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { CutVideoKeyHandler } from 'src/video/presentation/CutVideoKeyHandler';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';
import { CutVideoPanel } from 'src/video/presentation/CutVideoPanel';
import { CutPoints } from 'src/video/facets/CutPoints';

type PropsT = {};

type DefaultPropsT = {
  cutPoints: CutPoints;
  display: Display;
  moveDisplay: MoveDisplay;
  profiling: Profiling;
  moveList: MoveListT;
  movesStore: MovesStore;
  moveListsEditing: Editing;
  moveLists: Array<MoveListT>;
  userProfile: UserProfileT;
  moveListsStore: MoveListsStore;
  cutVideoPanel: any;
};

export const MoveListDetailsPage: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    if (!props.moveList) {
      return <React.Fragment />;
    }

    const bannedMoveListSlugs = props.moveLists
      .filter((x: MoveListT) => props.profiling.isOwner(x))
      .filter((x: MoveListT) => x.id !== props.moveList.id)
      .map((x: MoveListT) => x.slug);

    const editBtn = (
      <FontAwesomeIcon
        key={1}
        className={classnames('ml-2 text-lg', {
          hidden: !props.profiling.isOwner(props.moveList),
        })}
        icon={faEdit}
        onClick={() => props.moveListsEditing.enable()}
      />
    );

    const followMoveListBtn = <FollowMoveListBtn key="followMoveListBtn" />;
    const space = <div key="space" className="flex flex-grow" />;

    const cutVideoPanel = (
      <CutVideoKeyHandler>
        <CutVideoPanel
          display={props.display}
          moveDisplay={props.moveDisplay}
          moveTags={keys(props.movesStore.tags)}
          cutPoints={props.cutPoints}
        />
      </CutVideoKeyHandler>
    );

    return props.moveListsEditing.isEditing ? (
      <MoveListForm
        moveList={props.moveList}
        autoFocus={true}
        knownTags={keys(props.moveListsStore.tags)}
        moveListSlugs={bannedMoveListSlugs}
        onSubmit={(values) => props.moveListsEditing.save(values)}
        onCancel={() => props.moveListsEditing.cancel()}
      />
    ) : (
      <div>
        <MoveListDetails
          moveList={props.moveList}
          buttons={[editBtn, space, followMoveListBtn]}
        />
        {props.userProfile && cutVideoPanel}
      </div>
    );
  }
);
