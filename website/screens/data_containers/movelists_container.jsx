// @flow

import {
  MoveListsData,
  createMoveListsData,
  displayedItemsCanBeSelected,
  previewedItemsAreDisplayed,
} from "screens/data_containers/bvrs/movelists_data";
import type { MoveListT } from "move_lists/types";
import { behaviour } from "screens/data_containers/utils";
import {
  Addition,
  createAddition,
} from "screens/data_containers/bvrs/addition";
import { Editing, createEditing } from "screens/data_containers/bvrs/editing";
import {
  Highlight,
  createHighlight,
} from "screens/data_containers/bvrs/highlight";
import {
  Insertion,
  createInsertion,
} from "screens/data_containers/bvrs/insertion";
import {
  Selection,
  createSelection,
} from "screens/data_containers/bvrs/selection";
import type { UserProfileT } from "profiles/types";
import { Policies } from "screens/data_containers/policies";
import { insertByCreatingAnItem } from "screens/data_containers/policies/insert_by_creating_an_item";
import { runInAction } from "utils/mobx_wrapper";

type MoveListsContainerPropsT = {
  setMoveLists: (Array<MoveListT>) => any,
  saveMoveList: (MoveListT, values: any) => any,
  createNewMoveList: any => MoveListT,
  storeHighlight: () => void,
  restoreHighlight: () => void,
};

export class MoveListsContainer {
  @behaviour(Addition) addition: Addition;
  @behaviour(Editing) editing: Editing;
  @behaviour(Highlight) highlight: Highlight;
  @behaviour(Insertion) insertion: Insertion;
  @behaviour(MoveListsData) data: MoveListsData;
  @behaviour(Selection) selection: Selection;

  _createBehaviours(props: MoveListsContainerPropsT) {
    this.addition = createAddition({
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
    this.editing = createEditing({
      saveItem: (values: any) => {
        if (this.highlight.item) {
          props.saveMoveList(this.highlight.item, values);
        }
      },
    });
    this.highlight = createHighlight();
    this.insertion = createInsertion({
      insertItems: preview => {
        props.setMoveLists(preview);
      },
    });
    this.data = createMoveListsData();
    this.selection = createSelection();
  }

  _applyPolicies(props: MoveListsContainerPropsT) {
    const itemById = [MoveListsData, "moveListById"];
    const inputItems = [MoveListsData, "moveLists"];
    const preview = [MoveListsData, "preview"];

    [
      Policies.selection.actsOnItems({ itemById }),

      Policies.highlight.actsOnItems({ itemById }),
      Policies.highlight.followsSelection,
      Policies.highlight.isStoredOnNewItem(props.storeHighlight),
      Policies.highlight.isRestoredOnCancelNewItem(props.restoreHighlight),

      Policies.insertion.actsOnItems({ items: inputItems }),
      Policies.insertion.createsThePreview({ preview }),
      Policies.insertion.picksAPayloadsSource({
        payloadSources: [insertByCreatingAnItem({ showPreview: true })],
      }),

      Policies.newItems.areCreatedBelowTheHighlight,
      Policies.newItems.areEdited,
      Policies.newItems.areInsertedWhenConfirmed,
      Policies.newItems.areConfirmedWhenSaved,
      Policies.newItems.areCanceledOnHighlightChange,

      previewedItemsAreDisplayed,
      displayedItemsCanBeSelected,
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
