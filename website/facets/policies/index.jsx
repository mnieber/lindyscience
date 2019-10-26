// @flow

import { newItemsAreFollowedWhenConfirmed } from "screens/movelists_container/policies/new_items_are_followed_when_confirmed";
import { labellingReceivesIds } from "facets/generic/labelling";
import {
  insertionActsOnItems,
  insertionCreatesThePreview,
} from "facets/generic/insertion";
import { selectionActsOnItems } from "facets/generic/selection";
import { highlightActsOnItems } from "facets/generic/highlight";
import { filteringActsOnItems } from "facets/generic/filtering";
import { highlightFollowsSelection } from "facets/policies/highlight_follows_selection";
import { highlightIsCorrectedOnFilterChange } from "facets/policies/highlight_is_corrected_on_filter_change";
import {
  highlightIsRestoredOnCancelNewItem,
  highlightIsStoredOnNewItem,
} from "facets/policies/highlight_is_stored_on_new_item";
import { insertionPicksAPayloadsSource } from "facets/policies/insertion_picks_a_payload_source";
import { insertionHappensOnDrop } from "facets/policies/insertion_happens_on_drop";
import { newItemsAreCreatedBelowTheHighlight } from "facets/policies/new_items_are_created_below_the_highlight";
import { newItemsAreInsertedWhenConfirmed } from "facets/policies/new_items_are_inserted_when_confirmed";
import { newItemsAreConfirmedWhenSaved } from "facets/policies/new_items_are_confirmed_when_saved";
import { newItemsAreCanceledOnHighlightChange } from "facets/policies/new_items_are_canceled_on_highlight_change";
import { newItemsAreEdited } from "facets/policies/new_items_are_edited";
import { filteringIsDisabledOnNewItem } from "facets/policies/filtering_is_disabled_on_new_item";

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
