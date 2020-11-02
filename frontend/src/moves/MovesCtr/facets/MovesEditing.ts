import { Editing } from 'facet-mobx/facets/Editing';
import { operation, exec } from 'facet';

export class MovesEditing extends Editing {
  @operation savePrivateData(values: any) {
    exec('savePrivateData');
  }
}
