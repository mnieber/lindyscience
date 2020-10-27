import { MenuProvider } from 'react-contexify';
import { observer } from 'mobx-react';
import * as React from 'react';
import classnames from 'classnames';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { MoveT } from 'src/moves/types';
import { Profiling } from 'src/session/facets/Profiling';
import { MoveListT } from 'src/move_lists/types';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Highlight } from 'facet-mobx/facets/Highlight';
import { Selection } from 'facet-mobx/facets/Selection';
import { Insertion } from 'facet-mobx/facets/Insertion';

// MoveList

type PropsT = {
  createHostedPanels: (move: MoveT) => any;
  moveContextMenu: any;
  navigateTo: (move: MoveT) => any;
  className?: string;
};

type DefaultPropsT = {
  profiling: Profiling;
  moveList: MoveListT;
  moves: Array<MoveT>;
  movesCtr: MovesContainer;
  movesInsertion: Insertion;
  movesHighlight: Highlight;
  movesSelection: Selection;
};

export const MoveList: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const drag = props.movesCtr.handlerDrag.drag;
  const selectionIds = props.movesSelection.ids || [];
  const highlightId = props.movesHighlight.id;

  const moveNodes = (props.moves || []).map((move: MoveT, idx: number) => {
    const hostedPanels = props.createHostedPanels(move);

    return (
      <div
        className={classnames({
          moveList__item: true,
          'moveList__item--selected': move && selectionIds.includes(move.id),
          'moveList__item--highlighted': move && move.id === highlightId,
          'moveList__item--drag_before':
            drag && drag.isBefore && drag.targetItemId === move.id,
          'moveList__item--drag_after':
            drag && !drag.isBefore && drag.targetItemId === move.id,
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
