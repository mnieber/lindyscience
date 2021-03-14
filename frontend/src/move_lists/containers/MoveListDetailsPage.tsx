import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import { MoveListForm } from 'src/move_lists/presentation/MoveListForm';
import { MoveListDetails } from 'src/move_lists/presentation/MoveListDetails';
import { useDefaultProps, FC } from 'react-default-props-context';
import { MoveListT } from 'src/move_lists/types';
import { Editing } from 'facility-facets/Editing';
import { CutVideoKeyHandler } from 'src/video/presentation/CutVideoKeyHandler';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';
import { CutVideoPanel } from 'src/video/presentation/CutVideoPanel';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {};

type DefaultPropsT = {
  moveList: MoveListT;
  moveListsEditing: Editing;
  moveLists: Array<MoveListT>;
  cutVideoPanel: any;
};

export const MoveListDetailsPage: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);
    const { profilingStore, tagsStore } = useStore();

    if (!props.moveList) {
      return <React.Fragment />;
    }

    const bannedMoveListSlugs = props.moveLists
      .filter((x: MoveListT) => profilingStore.isOwner(x))
      .filter((x: MoveListT) => x.id !== props.moveList.id)
      .map((x: MoveListT) => x.slug);

    const editBtn = (
      <FontAwesomeIcon
        key={1}
        className={classnames('ml-2 text-lg', {
          hidden: !profilingStore.isOwner(props.moveList),
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
        knownTags={tagsStore.moveListTags}
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
        {profilingStore.userProfile && (
          <CutVideoKeyHandler>
            <CutVideoPanel />
          </CutVideoKeyHandler>
        )}
      </div>
    );
  }
);
