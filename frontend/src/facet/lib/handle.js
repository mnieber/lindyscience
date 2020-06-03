import { facetName } from 'src/facet/internal/logging';
import { symbols } from 'src/facet/internal/symbols';
import { getOrCreate } from 'src/facet/internal/utils';

export function handle(operationHost, operationMember, callback) {
  if (!operationHost[operationMember]) {
    console.error(`No member function ${operationMember} in ${operationHost}`);
  }
  const handlers = getOrCreate(
    operationHost,
    symbols.operationHandlers,
    () => ({})
  );
  if (operationMember in handlers) {
    console.error(
      `Operation ${operationMember} in facet ${facetName(
        operationHost
      )} already has a handler`
    );
  }
  handlers[operationMember] = callback;
}
