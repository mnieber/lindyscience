import { Addition } from 'facet-mobx/facets/Addition';

export const handleNavigateToNewMove = (navigateToMove: Function) =>
  function (this: Addition) {
    if (this.item) {
      navigateToMove(this.item);
    }
  };
