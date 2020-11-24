import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import { TagsStore } from 'src/tags/TagsStore';
import { MoveListForm } from 'src/move_lists/presentation/MoveListForm';
import { MoveListDetails } from 'src/move_lists/presentation/MoveListDetails';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Profiling } from 'src/session/facets/Profiling';
import { MoveListT } from 'src/move_lists/types';
import { Editing } from 'facility-mobx/facets/Editing';
import { UserProfileT } from 'src/profiles/types';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { CutVideoKeyHandler } from 'src/video/presentation/CutVideoKeyHandler';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';
import { CutVideoPanel } from 'src/video/presentation/CutVideoPanel';

type PropsT = {};

type DefaultPropsT = {
  profiling: Profiling;
  moveList: MoveListT;
  moveListsEditing: Editing;
  moveLists: Array<MoveListT>;
  userProfile: UserProfileT;
  moveListsStore: MoveListsStore;
  cutVideoPanel: any;
  tagsStore: TagsStore;
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

    return props.moveListsEditing.isEditing ? (
      <MoveListForm
        moveList={props.moveList}
        autoFocus={true}
        knownTags={props.tagsStore.moveListTags}
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
        {props.userProfile && (
          <CutVideoKeyHandler>
            <CutVideoPanel />
          </CutVideoKeyHandler>
        )}
      </div>
    );
  }
);
