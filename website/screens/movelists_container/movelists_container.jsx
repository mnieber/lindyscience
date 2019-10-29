// @flow

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
import type { UUID } from "kernel/types";
import { Labelling, initLabelling } from "facet-mobx/facets/labelling";
import { getIds } from "app/utils";
import type { MoveListT } from "move_lists/types";
import { Addition, initAddition } from "facet-mobx/facets/addition";
import { Editing, initEditing } from "facet-mobx/facets/editing";
import { Highlight, initHighlight } from "facet-mobx/facets/highlight";
import { Insertion, initInsertion } from "facet-mobx/facets/insertion";
import { Selection, initSelection } from "facet-mobx/facets/selection";
import type { UserProfileT } from "profiles/types";
import { Policies } from "screens/facet/policies";
import { insertByCreatingAnItem } from "facet-mobx/policies/insert_by_creating_a_new_item";
import { runInAction } from "utils/mobx_wrapper";

export type MoveListsContainerPropsT = {
  isEqual: (lhs: any, rhs: any) => boolean,
  setMoveLists: (Array<MoveListT>) => any,
  saveMoveList: (MoveListT, values: any) => any,
  createNewMoveList: any => MoveListT,
  storeLocation: () => void,
  restoreLocation: () => void,
  setFollowedMoveListIds: (ids: Array<UUID>) => void,
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
        const userProfile = this.inputs.userProfile;
        return userProfile
          ? props.createNewMoveList({
              ...values,
              ownerId: userProfile.userId,
              ownerUsername: userProfile.username,
            })
          : undefined;
      },
      isEqual: props.isEqual,
    });
    this.editing = initEditing(new Editing(), {
      saveItem: (values: any) => {
        if (this.highlight.item) {
          props.saveMoveList(this.highlight.item, values);
        }
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
      Policies.selection.actsOnItems(itemById),

      Policies.highlight.actsOnItems(itemById),
      Policies.highlight.followsSelection,

      Policies.navigation.locationIsStoredOnNewItem(props.storeLocation),
      Policies.navigation.locationIsRestoredOnCancelNewItem(
        props.restoreLocation
      ),

      Policies.insertion.actsOnItems(inputItems),
      Policies.insertion.createsThePreview({ preview }),
      Policies.insertion.picksAPayloadsSource({
        payloadSources: [insertByCreatingAnItem({ showPreview: true })],
      }),

      Policies.newItems.areCreatedBelowTheHighlight,
      Policies.newItems.areEdited,
      Policies.newItems.areConfirmedWhenSaved,
      Policies.newItems.areInsertedWhenConfirmed,
      Policies.newItems.areFollowedWhenConfirmed,
      Policies.newItems.areCanceledOnHighlightChange,

      Policies.labelling.receivesIds(
        [Inputs, "moveListsFollowing"],
        "following",
        getIds
      ),
      mapData([Outputs, "preview"], [Outputs, "display"]),
      mapData([Outputs, "display"], [Selection, "selectableIds"], getIds),
    ];

    installPolicies(policies, this);
  }

  constructor(props: MoveListsContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(moveLists: Array<MoveListT>, userProfile: ?UserProfileT) {
    runInAction("moveListsContainer.setInputs", () => {
      this.inputs.moveLists = moveLists;
      this.inputs.userProfile = userProfile;
    });
  }

  static get: GetFacet<MoveListsContainer>;
}
