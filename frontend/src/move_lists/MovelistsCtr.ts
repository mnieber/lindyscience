import { Profiling } from 'src/session/facets/Profiling';
import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
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
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import * as MobXFacets from 'facet-mobx/facets';
import * as MobXPolicies from 'facet-mobx/policies';
import * as MoveListsCtrPolicies from 'src/move_lists/policies';
import * as MoveListsCtrHandlers from 'src/move_lists/handlers';
import * as SessionCtrPolicies from 'src/session/policies';

const compareById = (lhs: any, rhs: any) => lhs.id === rhs.id;

type PropsT = {
  navigation: Navigation;
  profiling: Profiling;
  moveListsStore: MoveListsStore;
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
      MobXPolicies.newItemsAreConfirmedWhenSaved(compareById),
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

    installPolicies<MoveListsContainer>(policies, this);
  }

  constructor(props: PropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: MoveListsCtrHandlers.handleCreateMoveList(this),
    });
    this.editing = initEditing(new Editing(), {
      saveItem: MoveListsCtrHandlers.handleSaveMoveList(props.moveListsStore)(
        this
      ),
    });
    this.highlight = initHighlight(new Highlight());
    this.insertion = initInsertion(new Insertion(), {
      insertItems: () => {
        // nothing to do
      },
    });
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());
    this.labelling = initLabelling(new Labelling(), {
      saveIds: MoveListsCtrHandlers.handleSaveLabels(props.profiling)(this),
    });

    registerFacets(this);
    this._applyPolicies(props);
  }
}
