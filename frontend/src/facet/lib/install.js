import { handle } from 'src/facet/lib/handle';
import { action } from 'mobx';

export function installPolicies(policies, ctr) {
  policies.forEach((policy) => {
    policy(ctr);
  });
}

export function installHandlers(handlers, facet) {
  Object.entries(handlers).forEach(([k, v]) => {
    handle(facet, k, action(v(facet)));
  });
}
