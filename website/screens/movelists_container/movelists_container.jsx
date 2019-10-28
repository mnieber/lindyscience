// @flow

import type { GetBvrT } from "facets/index";
import { facet, facetClass, mapData, relayData } from "facets/index";
import type { UUID } from "kernel/types";
import { Labelling, initLabelling } from "facets/generic/labelling";
import { getIds } from "app/utils";
import { Inputs, initMoveListsData } from "screens/movelists_container/inputs";
import type { MoveListT } from "move_lists/types";
import { Addition, initAddition } from "facets/generic/addition";
import { Editing, initEditing } from "facets/generic/editing";
import { Highlight, initHighlight } from "facets/generic/highlight";
import { Insertion, initInsertion } from "facets/generic/insertion";
import { Selection, initSelection } from "facets/generic/selection";
import type { UserProfileT } from "profiles/types";
import { Policies } from "facets/policies";
import { insertByCreatingAnItem } from "facets/policies/insert_by_creating_a_new_item";
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
    this.inputs = initMoveListsData(new Inputs());
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
    const itemById = [Inputs, "moveListById"];
    const inputItems = [Inputs, "moveLists"];
    const preview = [Inputs, "preview"];

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
      mapData([Inputs, "preview"], [Inputs, "display"]),
      mapData([Inputs, "display"], [Selection, "selectableIds"], getIds),
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

  static get: GetBvrT<MoveListsContainer>;
}
