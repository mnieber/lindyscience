import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import CheeseburgerMenu from 'cheeseburger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

import { AccountMenu } from 'src/app/presentation/AccountMenu';
import { Addition } from 'facility-mobx/facets/Addition';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { Display as SessionDisplay } from 'src/session/facets/Display';
import { Filtering } from 'facility-mobx/facets/Filtering';
import { getId } from 'src/app/utils';
import { isNone } from 'src/utils/utils';
import { MoveContextMenu } from 'src/moves/presentation/MoveContextMenu';
import { MoveList } from 'src/move_lists/presentation/MoveList';
import { MoveListFilter } from 'src/move_lists/presentation/MoveListFilter';
import { MoveListHeader } from 'src/move_lists/presentation/MoveListHeader';
import { MoveListPicker } from 'src/move_lists/presentation/MoveListPicker';
import { MoveListPlayer } from 'src/move_lists/presentation/MoveListPlayer';
import { MoveListT } from 'src/move_lists/types';
import { MoveT } from 'src/moves/types';
import { sayMove } from 'src/moves/MovesCtr/handlers/sayMove';
import { Selection } from 'facility-mobx/facets/Selection';
import { useDefaultProps, FC } from 'react-default-props-context';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  moveLists: Array<MoveListT>;
  moveList?: MoveListT;
  movesSelection: Selection;
  movesFiltering: Filtering;
  movesAddition: Addition;
  sessionDisplay: SessionDisplay;
  movesClipboard: Clipboard;
};

export const MoveListFrame: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const { navigationStore, profilingStore, tagsStore } = useStore();
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const moveListId = getId(props.moveList);
    const targetMoveLists = props.movesClipboard.targetMoveLists;

    const targetMoveListsForMoving = props.moveLists.filter(
      (x: MoveListT) => moveListId !== getId(x)
    );

    const moveContextMenu = (
      <MoveContextMenu
        targetMoveLists={targetMoveLists || []}
        targetMoveListsForMoving={targetMoveListsForMoving}
        movesClipboard={props.movesClipboard}
        isOwnerOfMoveList={
          !!props.moveList && !!profilingStore.isOwner(props.moveList)
        }
      />
    );

    const moveListPlayerBtns = (
      <MoveListPlayer
        moves={props.movesSelection.items ?? []}
        sayMove={sayMove}
        className=""
      />
    );

    const showMoveList = (ml: MoveListT) =>
      !profilingStore.userProfile ||
      profilingStore.userProfile.moveListIds.includes(ml.id);

    const moveListPicker = (
      <MoveListPicker
        key={props.moveList ? props.moveList.id : ''}
        className=""
        filter={showMoveList}
        navigateTo={(x: MoveListT) => navigationStore.navigateToMoveList(x)}
      />
    );

    const moveListHeaderBtns = (
      <MoveListHeader
        addNewMove={() => props.movesAddition.add({})}
        className="ml-2"
      />
    );

    const moveListFilter = (
      <MoveListFilter
        className=""
        moveTags={tagsStore.moveTags}
        movesFiltering={props.movesFiltering}
      />
    );

    const createHostedPanels = (move: MoveT) => {
      const icon = (
        <FontAwesomeIcon
          className={'ml-2 opacity-50'}
          style={{ marginBottom: '1px' }}
          icon={faVideo}
          size="xs"
        />
      );
      return isNone(move.link) || move.link === '' ? undefined : icon;
    };

    const moveListWidget = (
      <MoveList
        className=""
        createHostedPanels={createHostedPanels}
        moveContextMenu={moveContextMenu}
        navigateTo={(x: MoveT) => {
          if (props.moveList) {
            navigationStore.navigateToMove(props.moveList, x);
          }
        }}
      />
    );

    const accountMenu = (
      <div className="pt-4 pb-8 mx-auto">
        <AccountMenu />
      </div>
    );

    const contents = (
      <div
        className={classnames('moveListPanel__inner flexcol', {
          'moveListPanel__inner--expanded': true,
        })}
      >
        {props.sessionDisplay.small && accountMenu}
        {moveListPicker}
        {moveListFilter}
        <div className="flexrow w-full my-4">
          {moveListPlayerBtns}
          {props.moveList &&
            profilingStore.isOwner(props.moveList) &&
            moveListHeaderBtns}
        </div>
        {moveListWidget}
      </div>
    );

    const shrunkContents = (
      <CheeseburgerMenu
        // width="20rem"
        width={320}
        isOpen={isMenuOpen}
        closeCallback={() => setIsMenuOpen(false)}
      >
        {contents}
      </CheeseburgerMenu>
    );

    const ribbon = (
      <div
        className="moveListPanel__ribbon"
        onClick={() => setIsMenuOpen(true)}
      />
    );

    return (
      <div className="MoveListFrame flexrow">
        {props.sessionDisplay.small ? shrunkContents : contents}
        {props.sessionDisplay.small && !isMenuOpen && ribbon}
        <div
          className={classnames('MoveListFrame__panel flex-auto', {
            'pl-4': !props.sessionDisplay.small,
            'pl-1': props.sessionDisplay.small,
          })}
        >
          {props.children}
        </div>
      </div>
    );
  }
);
