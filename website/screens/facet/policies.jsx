// @flow

import { handleNavigateToMove } from "screens/move_container/policies/handle_navigate_to_move";
import {
  syncMoveWithCurrentUrl,
  syncUrlWithNewMove,
} from "screens/session_container/policies/select_the_move_that_matches_the_url";
import { selectTheMoveListThatMatchesTheUrl } from "screens/session_container/policies/select_the_movelist_that_matches_the_url";
import {
  locationIsRestoredOnCancelNewItem,
  locationIsStoredOnNewItem,
} from "facet-mobx/policies/location_is_stored_on_new_item";
import { newItemsAreFollowedWhenConfirmed } from "screens/movelists_container/policies/new_items_are_followed_when_confirmed";
import { labellingReceivesIds } from "facet-mobx/facets/labelling";
import {
  insertionActsOnItems,
  insertionCreatesThePreview,
} from "facet-mobx/facets/insertion";
import { selectionActsOnItems } from "facet-mobx/facets/selection";
import { highlightActsOnItems } from "facet-mobx/facets/highlight";
import { filteringActsOnItems } from "facet-mobx/facets/filtering";
import { highlightFollowsSelection } from "facet-mobx/policies/highlight_follows_selection";
import { highlightIsCorrectedOnFilterChange } from "facet-mobx/policies/highlight_is_corrected_on_filter_change";
import { insertionPicksAPayloadsSource } from "facet-mobx/policies/insertion_picks_a_payload_source";
import { insertionHappensOnDrop } from "facet-mobx/policies/insertion_happens_on_drop";
import { newItemsAreCreatedBelowTheHighlight } from "facet-mobx/policies/new_items_are_created_below_the_highlight";
import { newItemsAreInsertedWhenConfirmed } from "facet-mobx/policies/new_items_are_inserted_when_confirmed";
import { newItemsAreConfirmedWhenSaved } from "facet-mobx/policies/new_items_are_confirmed_when_saved";
import { newItemsAreCanceledOnHighlightChange } from "facet-mobx/policies/new_items_are_canceled_on_highlight_change";
import { newItemsAreEdited } from "facet-mobx/policies/new_items_are_edited";
import { filteringIsDisabledOnNewItem } from "facet-mobx/policies/filtering_is_disabled_on_new_item";

export const Policies = {
  selection: {
    actsOnItems: selectionActsOnItems,
    selectTheMoveListThatMatchesTheUrl,
  },
  highlight: {
    actsOnItems: highlightActsOnItems,
    followsSelection: highlightFollowsSelection,
    isCorrectedOnFilterChange: highlightIsCorrectedOnFilterChange,
  },
  navigation: {
    locationIsStoredOnNewItem,
    locationIsRestoredOnCancelNewItem,
    handleNavigateToMove,
    syncUrlWithNewMove,
    syncMoveWithCurrentUrl,
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
