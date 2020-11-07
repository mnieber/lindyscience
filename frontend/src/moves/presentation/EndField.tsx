import React from 'react';
import { useFormStateContext } from 'react-form-state-context';
import { truncDecimals } from 'src/utils/utils';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { TextField } from 'src/forms/components/TextField';
import { Field } from 'src/forms/components/Field';

interface PropsT {
  videoController: VideoController;
}

export const EndField = (props: PropsT) => {
  const formState = useFormStateContext();

  const UpdateEndBtn = () => (
    <div
      className={'FieldButton'}
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

  const GotoEndBtn = () => (
    <div
      className={'FieldButton'}
      onClick={() => goToTime(formState.values.endTime)}
    >
      Go
    </div>
  );

  return (
    <Field
      label="End time"
      fieldName="endTime"
      buttons={[
        <UpdateEndBtn key="updateEndBtn" />,
        <GotoEndBtn key="gotoEndBtn" />,
      ]}
    >
      <TextField
        controlled={true}
        className="w-full"
        placeholder="End time in seconds"
      />
    </Field>
  );
};
