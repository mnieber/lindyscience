// @flow

import * as React from 'react'

import { Move } from 'moves/presentation/move'
import { TipsPanel } from 'moves/presentation/tips_panel'
import { MoveList } from 'moves/presentation/movelist';
import { StaticMoveList } from 'moves/presentation/static_movelist';
import { MoveForm } from 'moves/presentation/move_form'
import { MoveListForm } from 'moves/presentation/move_list_form'
import { MoveListDetails } from 'moves/presentation/move_list_details'
import { VideoLinksPanel } from 'moves/presentation/videolinks_panel'
import { MovePrivateDataPanel } from 'moves/presentation/move_private_data_panel';
import { StaticVideoLinksPanel } from 'moves/presentation/static_videolinks_panel'
import { StaticTipsPanel } from 'moves/presentation/static_tips_panel'
import { MoveListPanel } from 'moves/presentation/move_list_panel';
import { MoveListFilter, MoveListPicker } from 'moves/presentation/movelist_filter';
import { MoveListHeader } from 'moves/presentation/movelist_header';

export type WidgetsT = {
  Move: any,
  TipsPanel: any,
  MoveList: any,
  StaticMoveList: any,
  MoveForm: any,
  MoveListForm: any,
  MoveListPanel: any,
  MoveListDetails: any,
  VideoLinksPanel: any,
  MovePrivateDataPanel: any,
  StaticVideoLinksPanel: any,
  StaticTipsPanel: any,
  MoveListFilter: any,
  MoveListPicker: any,
  MoveListHeader: any,
};

const Widgets: WidgetsT = {
  Move,
  TipsPanel,
  MoveList,
  StaticMoveList,
  MoveForm,
  MoveListForm,
  MoveListPanel,
  MoveListDetails,
  VideoLinksPanel,
  MovePrivateDataPanel,
  StaticVideoLinksPanel,
  StaticTipsPanel,
  MoveListFilter,
  MoveListPicker,
  MoveListHeader,
}

export default Widgets;
