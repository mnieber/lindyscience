// @flow

import * as React from "react";

import { Move } from "moves/presentation/move";
import { MoveHeader } from "moves/presentation/move_header";
import { TipsPanel } from "tips/presentation/tips_panel";
import { MoveList } from "move_lists/presentation/movelist";
import { MoveForm } from "moves/presentation/move_form";
import { MoveContextMenu } from "screens/presentation/move_context_menu";
import { MoveListForm } from "move_lists/presentation/move_list_form";
import { MoveListTable } from "screens/presentation/move_list_table";
import { MoveTable } from "screens/presentation/move_table";
import { MoveListDetails } from "move_lists/presentation/move_list_details";
import { CutVideoPanel } from "video/presentation/cut_video_panel";
import { MovePrivateDataPanel } from "moves/presentation/move_private_data_panel";
import { MoveListPlayer } from "screens/presentation/move_list_player";
import { SearchMovesForm } from "screens/presentation/search_moves_form";
import {
  MoveListFilter,
  MoveListPicker,
} from "move_lists/presentation/movelist_filter";
import { MoveListHeader } from "move_lists/presentation/movelist_header";

const Widgets = {
  Move,
  MoveHeader,
  TipsPanel,
  MoveList,
  MoveForm,
  MoveContextMenu,
  MoveListForm,
  MoveListTable,
  MoveTable,
  MoveListPlayer,
  MoveListDetails,
  CutVideoPanel,
  MovePrivateDataPanel,
  SearchMovesForm,
  MoveListFilter,
  MoveListPicker,
  MoveListHeader,
};

export default Widgets;
