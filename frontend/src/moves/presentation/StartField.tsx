import React from 'react';
import { useFormStateContext } from 'react-form-state-context';
import { truncDecimals } from 'src/utils/utils';
import { TextField } from 'src/forms/components/TextField';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { Field } from 'src/forms/components/Field';

interface PropsT {
  videoController: VideoController;
}

export const StartField = (props: PropsT) => {
  const formState = useFormStateContext();

  const UpdateStartBtn = () => {
    return (
      <div
        key="updateStartBtn"
        className={'button ml-2 flex-none'}
        onClick={() => {
          formState.setValue(
            'startTime',
            truncDecimals(props.videoController.getPlayer().getCurrentTime(), 2)
          );
        }}
      >
        Set
      </div>
    );
  };

  const goToTime = (tAsString: string) => {
    try {
      const t = parseFloat(tAsString);
      props.videoController.getPlayer().seekTo(t);
    } catch {}
  };

  const GotoStartBtn = () => {
    return (
      <div
        key="gotoStartBtn"
        className={'button ml-2 flex-none'}
        onClick={() => goToTime(formState.values.startTime)}
      >
        Go
      </div>
    );
  };

  return (
    <Field
      label="Start time"
      fieldName="startTime"
      buttons={[<UpdateStartBtn />, <GotoStartBtn />]}
    >
      <TextField className="w-full" placeholder="Start time in seconds" />
    </Field>
  );
};
