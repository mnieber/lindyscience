import { symbols } from 'src/npm/facet/internal/symbols';

export function getCtr(facet) {
  return facet[symbols.parentContainer];
}

export function setCtr(facet, ctr) {
  facet[symbols.parentContainer] = ctr;
}
