// @flow

import { labellingReceivesIds } from "screens/data_containers/bvrs/labelling";
import {
  insertionActsOnItems,
  insertionCreatesThePreview,
} from "screens/data_containers/bvrs/insertion";
import { selectionActsOnItems } from "screens/data_containers/bvrs/selection";
import { highlightActsOnItems } from "screens/data_containers/bvrs/highlight";
import { filteringActsOnItems } from "screens/data_containers/bvrs/filtering";
import { highlightFollowsSelection } from "screens/data_containers/policies/highlight_follows_selection";
import { highlightIsCorrectedOnFilterChange } from "screens/data_containers/policies/highlight_is_corrected_on_filter_change";
import {
  highlightIsRestoredOnCancelNewItem,
  highlightIsStoredOnNewItem,
} from "screens/data_containers/policies/highlight_is_stored_on_new_item";
import { insertionPicksAPayloadsSource } from "screens/data_containers/policies/insertion_picks_a_payload_source";
import { insertionHappensOnDrop } from "screens/data_containers/policies/insertion_happens_on_drop";
import { newItemsAreCreatedBelowTheHighlight } from "screens/data_containers/policies/new_items_are_created_below_the_highlight";
import { newItemsAreInsertedWhenConfirmed } from "screens/data_containers/policies/new_items_are_inserted_when_confirmed";
import { newItemsAreConfirmedWhenSaved } from "screens/data_containers/policies/new_items_are_confirmed_when_saved";
import { newItemsAreCanceledOnHighlightChange } from "screens/data_containers/policies/new_items_are_canceled_on_highlight_change";
import { newItemsAreEdited } from "screens/data_containers/policies/new_items_are_edited";
import { filteringIsDisabledOnNewItem } from "screens/data_containers/policies/filtering_is_disabled_on_new_item";

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
  },
  filtering: {
    actsOnItems: filteringActsOnItems,
    isDisabledOnNewItem: filteringIsDisabledOnNewItem,
  },
  labelling: {
    receivesIds: labellingReceivesIds,
  },
};
