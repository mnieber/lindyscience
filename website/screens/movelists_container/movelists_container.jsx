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
      Policies.selection.actsOnItems(itemById),
      Policies.selection.selectTheMoveListThatMatchesTheUrl(props.navigation),

      Policies.highlight.actsOnItems(itemById),
      Policies.highlight.followsSelection,

      Policies.navigation.locationIsStoredOnNewItem(
        props.navigation.storeLocation
      ),
      Policies.navigation.locationIsRestoredOnCancelNewItem(
        props.navigation.restoreLocation
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

  static get: GetFacet<MoveListsContainer>;
}
