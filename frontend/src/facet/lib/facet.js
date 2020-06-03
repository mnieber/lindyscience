import { setCtr } from 'src/facet/internal/ctr';
import { getOrCreate } from 'src/facet/internal/utils';
import { symbols } from 'src/facet/internal/symbols';

export function facet(facetHost, facetMember, descriptor) {
  // Add the facetMember to the list of facetNembers
  const facetMembers = getOrCreate(
    facetHost.constructor,
    symbols.facetMembers,
    () => []
  );
  facetMembers.push(facetMember);

  return descriptor;
}

export function registerFacets(ctr) {
  const facetMembers = ctr.constructor[symbols.facetMembers];
  (facetMembers || []).forEach((member) => setCtr(ctr[member], ctr));
}

export function getFacet(facetClass, ctr) {
  if (!facetClass.get) {
    console.error(`No get function in facet ${facetClass.name}`);
  }
  const facet = facetClass.get(ctr);
  if (!facet) {
    console.error(
      `No facet ${facetClass.name} in container ${ctr.constructor.name}`
    );
  }
  return facet;
}
