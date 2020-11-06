import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import CheeseburgerMenu from 'cheeseburger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { keys } from 'lodash/fp';

import { AccountMenu } from 'src/app/presentation/AccountMenu';
import { Addition } from 'facet-mobx/facets/Addition';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { Display as SessionDisplay } from 'src/session/facets/Display';
import { Filtering } from 'facet-mobx/facets/Filtering';
import { getId } from 'src/app/utils';
import { isNone } from 'src/utils/utils';
import { MoveContextMenu } from 'src/moves/presentation/MoveContextMenu';
import { MoveList } from 'src/move_lists/presentation/MoveList';
import { MoveListFilter } from 'src/move_lists/presentation/MoveListFilter';
import { MoveListHeader } from 'src/move_lists/presentation/MoveListHeader';
import { MoveListPicker } from 'src/move_lists/presentation/MoveListPicker';
import { MoveListPlayer } from 'src/move_lists/presentation/MoveListPlayer';
import { MoveListT } from 'src/move_lists/types';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveT } from 'src/moves/types';
import { Navigation } from 'src/session/facets/Navigation';
import { Profiling } from 'src/session/facets/Profiling';
import { sayMove } from 'src/moves/MovesCtr/handlers/sayMove';
import { Selection } from 'facet-mobx/facets/Selection';
import { useDefaultProps, FC } from 'react-default-props-context';
import { UserProfileT } from 'src/profiles/types';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  profiling: Profiling;
  moveLists: Array<MoveListT>;
  moveList?: MoveListT;
  movesSelection: Selection;
  userProfile?: UserProfileT;
  movesFiltering: Filtering;
  movesAddition: Addition;
  navigation: Navigation;
  sessionDisplay: SessionDisplay;
  movesStore: MovesStore;
  movesClipboard: Clipboard;
  isOwner: (obj: any) => boolean;
};

export const MoveListFrame: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
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
        isOwnerOfMoveList={!!props.moveList && !!props.isOwner(props.moveList)}
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
      !props.userProfile || props.userProfile.moveListIds.includes(ml.id);

    const moveListPicker = (
      <MoveListPicker
        key={props.moveList ? props.moveList.id : ''}
        className=""
        filter={showMoveList}
        navigateTo={(x: MoveListT) => props.navigation.navigateToMoveList(x)}
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
        moveTags={keys(props.movesStore.tags)}
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
            props.navigation.navigateToMove(props.moveList, x);
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
            props.profiling.isOwner(props.moveList) &&
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
