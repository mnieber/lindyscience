// @flow

import { Inputs, initInputs } from "screens/movelists_container/facets/inputs";
import {
  Outputs,
  initOutputs,
} from "screens/movelists_container/facets/outputs";
import { type GetFacet, facet, facetClass, mapData } from "facet/index";
import type { UUID } from "kernel/types";
import { Labelling, initLabelling } from "facet/facets/labelling";
import { getIds } from "app/utils";
import type { MoveListT } from "move_lists/types";
import { Addition, initAddition } from "facet/facets/addition";
import { Editing, initEditing } from "facet/facets/editing";
import { Highlight, initHighlight } from "facet/facets/highlight";
import { Insertion, initInsertion } from "facet/facets/insertion";
import { Selection, initSelection } from "facet/facets/selection";
import type { UserProfileT } from "profiles/types";
import { Policies } from "facet/policies";
import { insertByCreatingAnItem } from "facet/policies/insert_by_creating_a_new_item";
import { runInAction } from "utils/mobx_wrapper";

type MoveListsContainerPropsT = {
  setMoveLists: (Array<MoveListT>) => any,
  saveMoveList: (MoveListT, values: any) => any,
  createNewMoveList: any => MoveListT,
  storeHighlight: () => void,
  restoreHighlight: () => void,
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

  _createBehaviours(props: MoveListsContainerPropsT) {
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
  }

  _applyPolicies(props: MoveListsContainerPropsT) {
    const inputItems = [Inputs, "moveLists"];
    const itemById = [Outputs, "moveListById"];
    const preview = [Outputs, "preview"];

    [
      Policies.selection.actsOnItems(itemById),

      Policies.highlight.actsOnItems(itemById),
      Policies.highlight.followsSelection,
      Policies.highlight.isStoredOnNewItem(props.storeHighlight),
      Policies.highlight.isRestoredOnCancelNewItem(props.restoreHighlight),

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
    ].forEach(policy => policy(this));
  }

  constructor(props: MoveListsContainerPropsT) {
    this._createBehaviours(props);
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
