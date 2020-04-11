// @flow

import { Navigation } from "screens/session_container/facets/navigation";
import { Inputs, initInputs } from "screens/movelists_container/facets/inputs";
import {
  Outputs,
  initOutputs,
} from "screens/movelists_container/facets/outputs";
import {
  type GetFacet,
  facet,
  facetClass,
  registerFacets,
  installPolicies,
} from "facet";
import { mapData } from "facet-mobx";
import { getIds } from "app/utils";
import { Labelling, initLabelling } from "facet-mobx/facets/labelling";
import { Addition, initAddition } from "facet-mobx/facets/addition";
import { Editing, initEditing } from "facet-mobx/facets/editing";
import { Highlight, initHighlight } from "facet-mobx/facets/highlight";
import { Insertion, initInsertion } from "facet-mobx/facets/insertion";
import { Selection, initSelection } from "facet-mobx/facets/selection";
import * as MobXFacets from "facet-mobx/facets";
import * as MobXPolicies from "facet-mobx/policies";
import * as MoveListsContainerPolicies from "screens/movelists_container/policies";
import * as SessionContainerPolicies from "screens/session_container/policies";
import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";

export type MoveListsContainerPropsT = {
  isEqual: (lhs: any, rhs: any) => boolean,
  setMoveLists: (Array<MoveListT>) => any,
  saveMoveList: (MoveListT, values: any) => any,
  createNewMoveList: any => MoveListT,
  setFollowedMoveListIds: (ids: Array<UUID>) => void,
  navigation: Navigation,
};

// $FlowFixMe
@facetClass
export class MoveListsContainer {
  @facet(Addition) addition: Addition;
  @facet(Editing) editing: Editing;
  @facet(Highlight) highlight: Highlight;
  @facet(Insertion) insertion: Insertion;
  @facet(Inputs) inputs: Inputs;
  @facet(Outputs) outputs: Outputs;
  @facet(Selection) selection: Selection;
  @facet(Labelling) labelling: Labelling;

  _createFacets(props: MoveListsContainerPropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: (values: any) => {
        const userProfile = (this.inputs.userProfile: any);
        return props.createNewMoveList({
          ...values,
          ownerId: userProfile.userId,
          ownerUsername: userProfile.username,
        });
      },
      isEqual: props.isEqual,
    });
    this.editing = initEditing(new Editing(), {
      saveItem: (values: any) => {
        props.saveMoveList((this.highlight.item: any), values);
      },
    });
    this.highlight = initHighlight(new Highlight());
    this.insertion = initInsertion(new Insertion(), {
      insertItems: preview => {
        props.setMoveLists(preview);
      },
    });
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());
    this.labelling = initLabelling(new Labelling(), {
      saveIds: (label: string, ids: Array<UUID>) => {
        if (label == "following") {
          props.setFollowedMoveListIds(ids);
        }
      },
    });

    registerFacets(this);
  }

  _applyPolicies(props: MoveListsContainerPropsT) {
    const inputItems = [Inputs, "moveLists"];
    const itemById = [Outputs, "moveListById"];
    const preview = [Outputs, "preview"];

    const policies = [
      // selection
      MobXFacets.selectionActsOnItems(itemById),
      SessionContainerPolicies.selectTheMoveListThatMatchesTheUrl(
        props.navigation
      ),

      // highlight
      MobXFacets.highlightActsOnItems(itemById),
      MobXPolicies.highlightFollowsSelection,

      // navigation
      MobXPolicies.locationIsStoredOnNewItem(props.navigation.storeLocation),
      MobXPolicies.locationIsRestoredOnCancelNewItem(
        props.navigation.restoreLocation
      ),

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXFacets.insertionCreatesThePreview({ preview }),
      MobXPolicies.insertionPicksAPayloadsSource({
        payloadSources: [
          MobXPolicies.insertByCreatingAnItem({ showPreview: true }),
        ],
      }),

      // creation
      MobXPolicies.newItemsAreCreatedBelowTheHighlight,
      MobXPolicies.newItemsAreEdited,
      MobXPolicies.newItemsAreConfirmedWhenSaved,
      MobXPolicies.newItemsAreInsertedWhenConfirmed,
      MoveListsContainerPolicies.newItemsAreFollowedWhenConfirmed,
      MobXPolicies.newItemsAreCanceledOnHighlightChange,

      // labelling
      MobXFacets.labellingReceivesIds(
        [Inputs, "moveListsFollowing"],
        "following",
        getIds
      ),

      // display
      mapData([Outputs, "preview"], [Outputs, "display"]),
      mapData([Outputs, "display"], [Selection, "selectableIds"], getIds),
    ];

    installPolicies(policies, this);
  }

  constructor(props: MoveListsContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  static get: GetFacet<MoveListsContainer>;
}
