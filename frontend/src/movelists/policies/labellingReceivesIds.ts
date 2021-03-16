import { onMakeCtrObservable } from 'skandha-mobx';
import { getm, ClassMemberT } from 'skandha';
import { Labelling } from 'skandha-facets/Labelling';
import { reaction } from 'mobx';
import { getIds } from 'src/app/utils';
import { MoveListsContainer } from 'src/movelists/MovelistsCtr';

export const labellingReceivesIds = (
  Collection_items: ClassMemberT,
  label: string
) => (ctr: MoveListsContainer) =>
  onMakeCtrObservable(ctr, () => {
    const cleanUpFunction = reaction(
      () => getm(Collection_items)(ctr),
      (items) => {
        Labelling.get(ctr).idsByLabel[label] = getIds(items);
      },
      {
        fireImmediately: true,
      }
    );
    ctr.addCleanUpFunction(cleanUpFunction);
  });
