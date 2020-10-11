import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
import { MoveListT } from 'src/move_lists/types';
import { UUID } from 'src/kernel/types';
import { Navigation } from 'src/session/facets/Navigation';
import { getIds } from 'src/app/utils';
import { facet, installPolicies, registerFacets } from 'facet';
import { mapData } from 'facet-mobx';
import { Labelling, initLabelling } from 'facet-mobx/facets/labelling';
import { Addition, initAddition } from 'facet-mobx/facets/addition';
import { Editing, initEditing } from 'facet-mobx/facets/editing';
import { Highlight, initHighlight } from 'facet-mobx/facets/highlight';
import { Insertion, initInsertion } from 'facet-mobx/facets/insertion';
import { Selection, initSelection } from 'facet-mobx/facets/selection';
import * as MobXFacets from 'facet-mobx/facets';
import * as MobXPolicies from 'facet-mobx/policies';
import * as MoveListsCtrPolicies from 'src/move_lists/policies';
import * as SessionCtrPolicies from 'src/session/policies';

type PropsT = {
  isEqual: (lhs: any, rhs: any) => boolean;
  setMoveLists: (moveLists: Array<MoveListT>) => any;
  saveMoveList: (moveList: MoveListT, values: any) => any;
  createNewMoveList: (values: any) => MoveListT;
  setFollowedMoveListIds: (ids: Array<UUID>) => void;
  navigation: Navigation;
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

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'moveLists'];
    const itemById = [Outputs, 'moveListById'];
    const preview = [Outputs, 'preview'];

    const policies = [
      // selection
      MobXFacets.selectionActsOnItems(itemById),
      SessionCtrPolicies.selectTheMoveListThatMatchesTheUrl(props.navigation),

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
      MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed,
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
    this.addition = initAddition(new Addition(), {
      createItem: (values: any) => {
        const userProfile = this.inputs.userProfile as any;
        return props.createNewMoveList({
          ...values,
          ownerId: userProfile.userId,
          ownerUsername: userProfile.username,
        });
      },
    });
    this.editing = initEditing(new Editing(), {
      saveItem: (values: any) => {
        props.saveMoveList(this.highlight.item as any, values);
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
        if (label === 'following') {
          props.setFollowedMoveListIds(ids);
        }
      },
    });

    registerFacets(this);
    this._applyPolicies(props);
  }
}