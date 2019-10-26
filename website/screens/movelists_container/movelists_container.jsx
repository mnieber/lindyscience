// @flow

import { behaviour, mapData, relayData } from "facets/index";
import type { UUID } from "kernel/types";
import { Labelling, initLabelling } from "facets/generic/labelling";
import { getIds } from "app/utils";
import {
  MoveListsData,
  initMoveListsData,
} from "screens/movelists_container/movelists_data";
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

export class MoveListsContainer {
  @behaviour(Addition) addition: Addition;
  @behaviour(Editing) editing: Editing;
  @behaviour(Highlight) highlight: Highlight;
  @behaviour(Insertion) insertion: Insertion;
  @behaviour(MoveListsData) data: MoveListsData;
  @behaviour(Selection) selection: Selection;
  @behaviour(Labelling) labelling: Labelling;

  _createBehaviours(props: MoveListsContainerPropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: (values: any) => {
        const userProfile = this.data._userProfile;
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
    this.data = initMoveListsData(new MoveListsData());
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
    const itemById = [MoveListsData, "moveListById"];
    const inputItems = [MoveListsData, "moveLists"];
    const preview = [MoveListsData, "preview"];

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
        [MoveListsData, "moveListsFollowing"],
        "following",
        getIds
      ),
      mapData([MoveListsData, "preview"], [MoveListsData, "display"]),
      mapData([MoveListsData, "display"], [Selection, "selectableIds"], getIds),
    ].forEach(policy => policy(this));
  }

  constructor(props: MoveListsContainerPropsT) {
    this._createBehaviours(props);
    this._applyPolicies(props);
  }

  setInputs(moveLists: Array<MoveListT>, userProfile: ?UserProfileT) {
    runInAction(() => {
      this.data.moveLists = moveLists;
      this.data._userProfile = userProfile;
    });
  }
}
