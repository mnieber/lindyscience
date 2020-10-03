// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import CheeseburgerMenu from 'cheeseburger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

import { Display } from 'src/session/facets/Display';
import { Profiling } from 'src/session/facets/Profiling';
import type { MoveListT } from 'src/move_lists/types';
import type { UserProfileT } from 'src/profiles/types';
import { Navigation } from 'src/session/facets/Navigation';
import { MovesStore } from 'src/moves/MovesStore';
import { withMoveContextMenu } from 'src/moves/hocs/withMoveContextMenu';
import { MoveListPlayer } from 'src/move_lists/presentation/MoveListPlayer';
import { sayMove } from 'src/moves/MovesCtr/handlers/sayMove';
import { MoveListPicker } from 'src/move_lists/presentation/MoveListPicker';
import { MoveListHeader } from 'src/move_lists/presentation/MoveListHeader';
import { MoveListFilter } from 'src/move_lists/presentation/MoveListFilter';
import { MoveList } from 'src/move_lists/presentation/MoveList';
import { AccountMenu } from 'src/app/presentation/AccountMenu';
import { isNone } from 'src/utils/utils';
import { Selection } from 'src/npm/facet-mobx/facets/selection';
import { Filtering } from 'src/npm/facet-mobx/facets/filtering';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Addition } from 'src/npm/facet-mobx/facets/addition';

// MoveListFrame

type PropsT = {
  children: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  profiling: Profiling,
  moveList: ?MoveListT,
  movesSelection: Selection,
  userProfile: ?UserProfileT,
  movesFiltering: Filtering,
  movesAddition: Addition,
  navigation: Navigation,
  display: Display,
  movesStore: MovesStore,
  moveContextMenu: any,
};

export const MoveListFrame: (PropsT) => any = compose(
  withMoveContextMenu,
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const moveListPlayerBtns = (
    <MoveListPlayer
      moves={props.movesSelection.items}
      sayMove={sayMove}
      className=""
    />
  );

  const isFollowing = (ml) =>
    !!props.userProfile && props.userProfile.moveListIds.includes(ml.id);

  const moveListPicker = (
    <MoveListPicker
      key={props.moveList ? props.moveList.id : ''}
      className=""
      filter={isFollowing}
      navigateTo={(x) => props.navigation.navigateToMoveList(x)}
      defaultProps={props.defaultProps}
    />
  );

  const moveListHeaderBtns = (
    <MoveListHeader
      addNewMove={() => {
        props.movesAddition.add({});
      }}
      className="ml-2"
    />
  );

  const moveListFilter = (
    <MoveListFilter
      className=""
      moveTags={Object.keys(props.movesStore.tags)}
      movesFiltering={props.movesFiltering}
    />
  );

  const createHostedPanels = (move) => {
    const icon = (
      <FontAwesomeIcon
        className={'ml-2 opacity-50'}
        style={{ marginBottom: '1px' }}
        icon={faVideo}
        size="xs"
      />
    );
    return isNone(move.link) || move.link == '' ? undefined : icon;
  };

  const moveListWidget = (
    <MoveList
      className=""
      createHostedPanels={createHostedPanels}
      moveContextMenu={props.moveContextMenu}
      navigateTo={(x) => props.navigation.navigateToMove(x)}
      defaultProps={props.defaultProps}
    />
  );

  const accountMenu = (
    <div className="pt-4 pb-8 mx-auto">
      <AccountMenu defaultProps={props.defaultProps} />
    </div>
  );

  const contents = (
    <div
      className={classnames('moveListPanel__inner flexcol', {
        'moveListPanel__inner--expanded': true,
      })}
    >
      {props.display.small && accountMenu}
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
      onClick={() => {
        setIsMenuOpen(true);
      }}
    />
  );
  return (
    <div className="moveListPanel flexrow">
      {props.display.small ? shrunkContents : contents}
      {props.display.small && !isMenuOpen && ribbon}
      <div
        className={classnames('movePanel flex-auto', {
          'pl-4': !props.display.small,
          'pl-1': props.display.small,
        })}
      >
        {props.children}
      </div>
    </div>
  );
});