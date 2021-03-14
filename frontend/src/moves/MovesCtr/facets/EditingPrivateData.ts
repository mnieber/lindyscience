import { Editing } from 'facility-facets/Editing';

export class EditingPrivateData extends Editing {
  static get = (ctr: any): EditingPrivateData => ctr.editingPrivateData;
}
