// @flow

import { Editing } from 'src/facet-mobx/facets/editing';

export type PropsT = {
  container: any,
};

export class EditWithKeys {
  props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  handle(keyEdit: string) {
    return {
      onKeyDown: (key: string, e: any) => {
        const ctr = this.props.container;
        if (key == keyEdit) {
          e.preventDefault();
          e.stopPropagation();
          Editing.get(ctr).setIsEditing(!Editing.get(ctr).isEditing);
        }
      },
    };
  }
}
