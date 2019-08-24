// @flow

import * as React from "react";

import { Move } from "moves/presentation/move";
import { TipsPanel } from "tips/presentation/tips_panel";
import { MoveList } from "screens/presentation/movelist";
import { MoveForm } from "moves/presentation/move_form";
import { MoveContextMenu } from "screens/presentation/move_context_menu";
import { MoveListForm } from "screens/presentation/move_list_form";
import { MoveListTable } from "screens/presentation/move_list_table";
import { MoveTable } from "screens/presentation/move_table";
import { MoveListDetails } from "screens/presentation/move_list_details";
import { VideoLinksPanel } from "videolinks/presentation/videolinks_panel";
import { MovePrivateDataPanel } from "moves/presentation/move_private_data_panel";
import { StaticVideoLinksPanel } from "videolinks/presentation/static_videolinks_panel";
import { StaticTipsPanel } from "tips/presentation/static_tips_panel";
import { MoveListPanel } from "screens/presentation/move_list_panel";
import { MoveListPlayer } from "screens/presentation/move_list_player";
import { SearchMovesDialog } from "screens/presentation/search_moves_dialog";
import { SearchMovesForm } from "screens/presentation/search_moves_form";
import {
  MoveListFilter,
  MoveListPicker,
} from "screens/presentation/movelist_filter";
import { MoveListHeader } from "screens/presentation/movelist_header";

const Widgets = {
  Move,
  TipsPanel,
  MoveList,
  MoveForm,
  MoveContextMenu,
  MoveListForm,
  MoveListTable,
  MoveTable,
  MoveListPanel,
  MoveListPlayer,
  MoveListDetails,
  VideoLinksPanel,
  MovePrivateDataPanel,
  StaticVideoLinksPanel,
  StaticTipsPanel,
  SearchMovesDialog,
  SearchMovesForm,
  MoveListFilter,
  MoveListPicker,
  MoveListHeader,
};

export default Widgets;
