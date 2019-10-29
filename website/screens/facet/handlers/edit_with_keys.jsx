// @flow

import { Editing } from "facet-mobx/facets/editing";

export type EditWithKeysPropsT = {
  container: any,
};

export class EditWithKeys {
  props: EditWithKeysPropsT;

  constructor(props: EditWithKeysPropsT) {
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
