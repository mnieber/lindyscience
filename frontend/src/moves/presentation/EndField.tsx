import React from 'react';
import { useFormStateContext } from 'react-form-state-context';
import { truncDecimals } from 'src/utils/utils';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { TextField } from 'src/forms/components/TextField';

interface PropsT {
  videoController: VideoController;
}

export const EndField = (props: PropsT) => {
  const formState = useFormStateContext();

  const updateEndBtn = (
    <div
      key="updateEndBtn"
      className={'button ml-2 flex-none'}
      onClick={() => {
        formState.setValue(
          'endTime',
          truncDecimals(props.videoController.getPlayer().getCurrentTime(), 2)
        );
      }}
    >
      Set
    </div>
  );

  const goToTime = (tAsString: string) => {
    try {
      const t = parseFloat(tAsString);
      props.videoController.getPlayer().seekTo(t);
    } catch {}
  };

  const gotoEndBtn = (
    <div
      key="gotoEndBtn"
      className={'button ml-2 flex-none'}
      onClick={() => goToTime(formState.values.endTime)}
    >
      Go
    </div>
  );

  return (
    <TextField
      classNames="w-full"
      label="End time"
      fieldName="endTime"
      type="text"
      placeholder="End time in seconds"
      buttons={[updateEndBtn, gotoEndBtn]}
    />
  );
};