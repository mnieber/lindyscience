import { onMakeCtrObservable } from 'skandha-mobx';
import { get, ClassMemberT } from 'skandha';
import { Labelling } from 'skandha-facets/Labelling';
import { reaction } from 'mobx';
import { getIds } from 'src/app/utils';
import { MoveListsContainer } from 'src/movelists/MovelistsCtr';

export const labellingReceivesIds = (
  [Collection, itemsMember]: ClassMemberT,
  label: string
) => (ctr: MoveListsContainer) =>
  onMakeCtrObservable(ctr, () => {
    const cleanUpFunction = reaction(
      () => get(Collection, ctr)[itemsMember],
      (items) => {
        Labelling.get(ctr).idsByLabel[label] = getIds(items);
      },
      {
        fireImmediately: true,
      }
    );
    ctr.addCleanUpFunction(cleanUpFunction);
  });
