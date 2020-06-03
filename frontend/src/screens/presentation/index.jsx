// @flow

import { Move } from 'src/moves/presentation/move';
import { MoveHeader } from 'src/moves/presentation/move_header';
import { TipsPanel } from 'src/tips/presentation/tips_panel';
import { MoveList } from 'src/move_lists/presentation/movelist';
import { MoveForm } from 'src/moves/presentation/move_form';
import { MoveContextMenu } from 'src/screens/presentation/move_context_menu';
import { MoveListForm } from 'src/move_lists/presentation/move_list_form';
import { MoveListTable } from 'src/screens/presentation/move_list_table';
import { MoveTable } from 'src/screens/presentation/move_table';
import { MoveListDetails } from 'src/move_lists/presentation/move_list_details';
import { CutVideoPanel } from 'src/video/presentation/cut_video_panel';
import { MovePrivateDataPanel } from 'src/moves/presentation/move_private_data_panel';
import { MoveListPlayer } from 'src/screens/presentation/move_list_player';
import { SearchMovesForm } from 'src/screens/presentation/search_moves_form';
import { MoveListFilter } from 'src/move_lists/presentation/movelist_filter';
import { MoveListPicker } from 'src/move_lists/presentation/movelist_picker';
import { MoveListHeader } from 'src/move_lists/presentation/movelist_header';

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
