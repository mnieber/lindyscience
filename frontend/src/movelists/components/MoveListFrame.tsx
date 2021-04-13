import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import CheeseburgerMenu from 'cheeseburger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

import { AccountMenu } from 'src/app/components/AccountMenu';
import { Addition } from 'skandha-facets/Addition';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { Display as SessionDisplay } from 'src/app/Display';
import { Filtering } from 'skandha-facets/Filtering';
import { getId } from 'src/app/utils';
import { isNone } from 'src/utils/utils';
import { MoveContextMenu } from 'src/moves/components/MoveContextMenu';
import { MoveList } from 'src/movelists/components/MoveList';
import { MoveListFilter } from 'src/movelists/components/MoveListFilter';
import { MoveListHeader } from 'src/movelists/components/MoveListHeader';
import { MoveListPicker } from 'src/movelists/components/MoveListPicker';
import { MoveListPlayer } from 'src/movelists/components/MoveListPlayer';
import { MoveListT } from 'src/movelists/types';
import { MoveT } from 'src/moves/types';
import { sayMove } from 'src/moves/MovesCtr/handlers/sayMove';
import { Selection } from 'skandha-facets/Selection';
import { useDefaultProps, FC } from 'react-default-props-context';
import { useStore } from 'src/app/components/StoreProvider';

import './MoveListFrame.scss';

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
    const { profilingStore, tagsStore } = useStore();
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
      />
    );

    const accountMenu = (
      <div className="pt-4 pb-8 mx-auto">
        <AccountMenu />
      </div>
    );

    const contents = (
      <div
        className={classnames('MoveListFrame__Inner flexcol', {
          'MoveListFrame__Inner--expanded': true,
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
        className="MoveListFrame__Ribbon"
        onClick={() => setIsMenuOpen(true)}
      />
    );

    return (
      <div className="MoveListFrame flexrow">
        {props.sessionDisplay.small ? shrunkContents : contents}
        {props.sessionDisplay.small && !isMenuOpen && ribbon}
        <div
          className={classnames('MoveListFrame__Panel flex-auto', {
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
