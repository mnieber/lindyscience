// @flow

import { values } from 'rambda';

import { facet, installPolicies, registerFacets } from 'src/facet';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import {
  Inputs,
  initInputs,
} from 'src/screens/movelists_container/facets/inputs';
import {
  Outputs,
  initOutputs,
} from 'src/screens/movelists_container/facets/outputs';
import { mapData } from 'src/facet-mobx';
import { getIds } from 'src/app/utils';
import { Labelling, initLabelling } from 'src/facet-mobx/facets/labelling';
import { Addition, initAddition } from 'src/facet-mobx/facets/addition';
import { Editing, initEditing } from 'src/facet-mobx/facets/editing';
import { Highlight, initHighlight } from 'src/facet-mobx/facets/highlight';
import { Insertion, initInsertion } from 'src/facet-mobx/facets/insertion';
import { Selection, initSelection } from 'src/facet-mobx/facets/selection';
import * as MobXFacets from 'src/facet-mobx/facets';
import * as MobXPolicies from 'src/facet-mobx/policies';
import * as MoveListsContainerPolicies from 'src/screens/movelists_container/policies';
import * as SessionContainerPolicies from 'src/screens/session_container/policies';
import type { UUID } from 'src/kernel/types';
import type { MoveListT } from 'src/move_lists/types';

type PropsT = {
  isEqual: (lhs: any, rhs: any) => boolean,
  setMoveLists: (Array<MoveListT>) => any,
  saveMoveList: (MoveListT, values: any) => any,
  createNewMoveList: (any) => MoveListT,
  setFollowedMoveListIds: (ids: Array<UUID>) => void,
  navigation: Navigation,
};

export class MoveListsContainer {
  @facet addition: Addition;
  @facet editing: Editing;
  @facet highlight: Highlight;
  @facet insertion: Insertion;
  @facet inputs: Inputs;
  @facet outputs: Outputs;
  @facet selection: Selection;
  @facet labelling: Labelling;

  _createFacets(props: PropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: (values: any) => {
        const userProfile = (this.inputs.userProfile: any);
        return props.createNewMoveList({
          ...values,
          ownerId: userProfile.userId,
          ownerUsername: userProfile.username,
        });
      },
    });
    this.editing = initEditing(new Editing(), {
      saveItem: (values: any) => {
        props.saveMoveList((this.highlight.item: any), values);
      },
    });
    this.highlight = initHighlight(new Highlight());
    this.insertion = initInsertion(new Insertion(), {
      insertItems: (preview) => {
        props.setMoveLists(preview);
      },
    });
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());
    this.labelling = initLabelling(new Labelling(), {
      saveIds: (label: string, ids: Array<UUID>) => {
        if (label == 'following') {
          props.setFollowedMoveListIds(ids);
        }
      },
    });

    registerFacets(this);
  }

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'moveLists'];
    const itemById = [Outputs, 'moveListById'];
    const preview = [Outputs, 'preview'];

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
      MobXPolicies.newItemsAreConfirmedWhenSaved(props.isEqual),
      MobXPolicies.newItemsAreInsertedWhenConfirmed,
      MoveListsContainerPolicies.newItemsAreFollowedWhenConfirmed,
      MobXPolicies.newItemsAreCanceledOnHighlightChange,

      // labelling
      MobXFacets.labellingReceivesIds(
        [Inputs, 'moveListsFollowing'],
        'following',
        getIds
      ),

      // display
      mapData([Outputs, 'preview'], [Outputs, 'display']),
      mapData([Outputs, 'display'], [Selection, 'selectableIds'], getIds),
    ];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }
}
