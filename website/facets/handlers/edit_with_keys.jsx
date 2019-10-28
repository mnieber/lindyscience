// @flow

import { Editing } from "facets/generic/editing";

export type EditWithKeysPropsT = {
  container: any,
};

export class EditWithKeys {
  props: EditWithKeysPropsT;

  constructor(props: EditWithKeysPropsT) {
    this.props = props;
  }

  handle(navigateTo: ?Function) {
    return {
      onKeyDown: (key: string, e: any) => {
        const ctr = this.props.container;
        if (key == "ctrl+e") {
          e.preventDefault();
          e.stopPropagation();
          Editing.get(ctr).setIsEditing(!Editing.get(ctr).isEditing);
        }
      },
    };
  }
}
