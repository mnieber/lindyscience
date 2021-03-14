import { onMakeCtrObservable, relayData } from 'facility-mobx';
import { ClassMemberT } from 'facility';
import { Labelling } from 'facility-facets/Labelling';

export const labellingReceivesIds = (
  [Collection, ids]: ClassMemberT,
  label: string,
  transform?: Function
) => (ctr: any) =>
  onMakeCtrObservable(ctr, () =>
    relayData(
      [Collection, ids],
      [Labelling, 'idsByLabel'],
      transform,
      (ids: any, idsByLabel: any) => {
        idsByLabel[label] = ids;
      }
    )(ctr)
  );
