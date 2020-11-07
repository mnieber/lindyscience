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
        className={'UpdateStartBtn FieldButton'}
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
        className={'GotoStartBtn FieldButton'}
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
      buttons={[
        <UpdateStartBtn key="updateStartBtn" />,
        <GotoStartBtn key="gotoStartBtn" />,
      ]}
    >
      <TextField
        controlled={true}
        className="w-full"
        placeholder="Start time in seconds"
      />
    </Field>
  );
};
