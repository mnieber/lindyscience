import { Editing } from 'facility-mobx/facets/Editing';

export type PropsT = {
  container: any;
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
        if (key === keyEdit) {
          e.preventDefault();
          e.stopPropagation();
          const editing = Editing.get(ctr);
          if (editing.isEditing) {
            editing.cancel();
          } else {
            editing.enable();
          }
        }
      },
    };
  }
}
