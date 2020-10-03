// @flow

import { compose } from 'rambda';
import { MenuProvider } from 'react-contexify';
import { observer } from 'mobx-react';
import * as React from 'react';
import classnames from 'classnames';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { MoveT } from 'src/moves/types';
import { Profiling } from 'src/session/facets/Profiling';
import { MoveListT } from 'src/move_lists/types';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Dragging } from 'src/npm/facet-mobx/facets/dragging';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';
import { Selection } from 'src/npm/facet-mobx/facets/selection';

// MoveList

type PropsT = {
  createHostedPanels: (MoveT) => any;
  moveContextMenu: any;
  navigateTo: (MoveT) => any;
  className?: string;
  defaultProps?: any;
};

type DefaultPropsT = {
  profiling: Profiling;
  moveList: MoveListT;
  moves: Array<MoveT>;
  movesCtr: MovesContainer;
  movesDragging: Dragging;
  movesHighlight: Highlight;
  movesSelection: Selection;
};

export const MoveList: React.FC<PropsT> = compose(observer)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const dragPosition = props.movesDragging.position;
  const selectionIds = props.movesSelection.ids || [];
  const highlightId = props.movesHighlight.id;

  const moveNodes = (props.moves || []).map((move, idx) => {
    const hostedPanels = props.createHostedPanels(move);

    return (
      <div
        className={classnames({
          moveList__item: true,
          'moveList__item--selected': move && selectionIds.includes(move.id),
          'moveList__item--highlighted': move && move.id == highlightId,
          'moveList__item--drag_before':
            dragPosition &&
            dragPosition.isBefore &&
            dragPosition.targetItemId == move.id,
          'moveList__item--drag_after':
            dragPosition &&
            !dragPosition.isBefore &&
            dragPosition.targetItemId == move.id,
        })}
        id={move.id}
        key={idx}
        {...props.movesCtr.handlerClick.handle(move.id, move, props.navigateTo)}
        {...(props.profiling.isOwner(props.moveList)
          ? props.movesCtr.handlerDrag.handle(move.id)
          : {})}
      >
        {move.name}
        {hostedPanels}
      </div>
    );
  });

  return (
    <React.Fragment>
      <KeyboardEventHandler
        handleKeys={['ctrl+.', 'ctrl+,']}
        handleFocusableElements={true}
        onKeyEvent={
          props.movesCtr.handlerSelectWithKeys.handle(
            ['ctrl+,'],
            ['ctrl+.'],
            props.navigateTo
          ).onKeyDown
        }
      />
      <KeyboardEventHandler
        handleKeys={['up', 'down']}
        onKeyEvent={
          props.movesCtr.handlerSelectWithKeys.handle(
            ['up'],
            ['down'],
            props.navigateTo
          ).onKeyDown
        }
      >
        <div
          className={classnames(props.className, 'moveList')}
          tabIndex={123}
          id="moveList"
        >
          <MenuProvider id="moveContextMenu">{moveNodes}</MenuProvider>
          {props.moveContextMenu}
        </div>
      </KeyboardEventHandler>
    </React.Fragment>
  );
});
