import { onMakeCtrObservable } from 'facility-mobx';
import { get, ClassMemberT } from 'facility';
import { Labelling } from 'facility-facets/Labelling';
import { reaction } from 'mobx';
import { getIds } from 'src/app/utils';

export const labellingReceivesIds = (
  [Collection, itemsMember]: ClassMemberT,
  label: string
) => (ctr: any) =>
  onMakeCtrObservable(ctr, () =>
    reaction(
      () => get(Collection, ctr)[itemsMember],
      (items) => {
        Labelling.get(ctr).idsByLabel[label] = getIds(items);
      },
      {
        fireImmediately: true,
      }
    )
  );
