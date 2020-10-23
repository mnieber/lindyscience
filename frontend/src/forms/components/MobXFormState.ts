import React from 'react';

import { clearObject } from 'src/utils/object';
import { observable, action } from 'src/utils/mobx_wrapper';

export class MobXFormState {
  @observable values: any[];

  constructor(values: any[]) {
    this.values = values;
  }

  @action setValues = (values: any[]) => {
    clearObject(this.values);
    for (const prop of Object.getOwnPropertyNames(values)) {
      this.values[prop as any] = values[prop as any];
    }
  };
}

export const useMobXState = (initialValues: any) => {
  const [container] = React.useState<MobXFormState>(
    () => new MobXFormState(initialValues)
  );
  return [container.values, container.setValues];
};
