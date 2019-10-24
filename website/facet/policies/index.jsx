// @flow

import { newItemsAreFollowedWhenConfirmed } from "screens/movelists_container/policies/new_items_are_followed_when_confirmed";
import { labellingReceivesIds } from "facet/facets/labelling";
import {
  insertionActsOnItems,
  insertionCreatesThePreview,
} from "facet/facets/insertion";
import { selectionActsOnItems } from "facet/facets/selection";
import { highlightActsOnItems } from "facet/facets/highlight";
import { filteringActsOnItems } from "facet/facets/filtering";
import { highlightFollowsSelection } from "facet/policies/highlight_follows_selection";
import { highlightIsCorrectedOnFilterChange } from "facet/policies/highlight_is_corrected_on_filter_change";
import {
  highlightIsRestoredOnCancelNewItem,
  highlightIsStoredOnNewItem,
} from "facet/policies/highlight_is_stored_on_new_item";
import { insertionPicksAPayloadsSource } from "facet/policies/insertion_picks_a_payload_source";
import { insertionHappensOnDrop } from "facet/policies/insertion_happens_on_drop";
import { newItemsAreCreatedBelowTheHighlight } from "facet/policies/new_items_are_created_below_the_highlight";
import { newItemsAreInsertedWhenConfirmed } from "facet/policies/new_items_are_inserted_when_confirmed";
import { newItemsAreConfirmedWhenSaved } from "facet/policies/new_items_are_confirmed_when_saved";
import { newItemsAreCanceledOnHighlightChange } from "facet/policies/new_items_are_canceled_on_highlight_change";
import { newItemsAreEdited } from "facet/policies/new_items_are_edited";
import { filteringIsDisabledOnNewItem } from "facet/policies/filtering_is_disabled_on_new_item";

export const Policies = {
  selection: {
    actsOnItems: selectionActsOnItems,
  },
  highlight: {
    actsOnItems: highlightActsOnItems,
    followsSelection: highlightFollowsSelection,
    isCorrectedOnFilterChange: highlightIsCorrectedOnFilterChange,
    isStoredOnNewItem: highlightIsStoredOnNewItem,
    isRestoredOnCancelNewItem: highlightIsRestoredOnCancelNewItem,
  },
  insertion: {
    actsOnItems: insertionActsOnItems,
    createsThePreview: insertionCreatesThePreview,
    picksAPayloadsSource: insertionPicksAPayloadsSource,
    happensOnDrop: insertionHappensOnDrop,
  },
  newItems: {
    areCreatedBelowTheHighlight: newItemsAreCreatedBelowTheHighlight,
    areInsertedWhenConfirmed: newItemsAreInsertedWhenConfirmed,
    areConfirmedWhenSaved: newItemsAreConfirmedWhenSaved,
    areCanceledOnHighlightChange: newItemsAreCanceledOnHighlightChange,
    areEdited: newItemsAreEdited,
    areFollowedWhenConfirmed: newItemsAreFollowedWhenConfirmed,
  },
  filtering: {
    actsOnItems: filteringActsOnItems,
    isDisabledOnNewItem: filteringIsDisabledOnNewItem,
  },
  labelling: {
    receivesIds: labellingReceivesIds,
  },
};
