import classnames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';
import { MenuProvider } from 'react-contexify';
import { FC, useDefaultProps } from 'react-default-props-context';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Highlight } from 'skandha-facets/Highlight';
import { Insertion } from 'skandha-facets/Insertion';
import { Selection } from 'skandha-facets/Selection';
import { useStore } from 'src/app/components/StoreProvider';
import { MoveListT } from 'src/movelists/types';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { MoveT } from 'src/moves/types';

type PropsT = {
  createHostedPanels: (move: MoveT) => any;
  moveContextMenu: any;
  className?: string;
};

type DefaultPropsT = {
  moveList: MoveListT;
  moves: Array<MoveT>;
  movesCtr: MovesContainer;
  movesInsertion: Insertion;
  movesHighlight: Highlight;
  movesSelection: Selection;
};

export const MoveList: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore } = useStore();

  const hoverPosition = props.movesCtr.dragAndDrop.hoverPosition;
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
            hoverPosition?.isBefore && hoverPosition?.targetItemId === move.id,
          'moveList__item--drag_after':
            !hoverPosition?.isBefore && hoverPosition?.targetItemId === move.id,
        })}
        id={move.id}
        key={idx}
        {...props.movesCtr.handlerClick.handle(move.id)}
        {...(profilingStore.isOwner(props.moveList)
          ? props.movesCtr.dragAndDrop.handle(move.id)
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
          props.movesCtr.handlerSelectWithKeys.handle(['ctrl+,'], ['ctrl+.'])
            .onKeyDown
        }
      />
      <KeyboardEventHandler
        handleKeys={['up', 'down']}
        onKeyEvent={
          props.movesCtr.handlerSelectWithKeys.handle(['up'], ['down'])
            .onKeyDown
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
