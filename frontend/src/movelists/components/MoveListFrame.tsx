import CheeseburgerMenu from 'cheeseburger-menu';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FC, useDefaultProps } from 'react-default-props-context';
import { Addition } from 'skandha-facets/Addition';
import { Filtering } from 'skandha-facets/Filtering';
import { Selection } from 'skandha-facets/Selection';
import { Display as SessionDisplay } from 'src/app/Display';
import { MoveListT } from 'src/movelists/types';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { MoveListPanel } from 'src/movelists/components/MoveListPanel';
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
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const contents = <MoveListPanel />;

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
