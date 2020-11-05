import React from 'react';

import {
  RST,
  isResetRS,
  isUpdatingRS,
  isUpdatedRS,
  isErroredRS,
} from 'src/utils/RST';

type PropsT<UpdatingT> = {
  rs: RST<UpdatingT>;
  renderUpdated: () => JSX.Element;
  renderUpdating?: (updating_state: UpdatingT) => JSX.Element;
  renderErrored?: (message: string) => JSX.Element;
};

// TODO better default renders
const defaultRenderErrored = (message: string) => {
  return <div>Error{message !== undefined && `: ${message}`}</div>;
};
const defaultRenderUpdating = () => {
  return <div>Loading...</div>;
};

export const ResourceView = <UpdatingT,>(
  props: PropsT<UpdatingT>
): JSX.Element => {
  const renderErrored = props.renderErrored ?? defaultRenderErrored;
  const renderUpdating = props.renderUpdating ?? defaultRenderUpdating;

  const tryRenderUpdated = () => {
    try {
      const result = props.renderUpdated();
      return result;
    } catch (e) {
      return renderErrored(e.message);
    }
  };

  const catchAll = () => {
    throw Error(`Received unrecognized resource state ${props.rs}`);
  };

  const renderReset = () => {
    // Have to use react fragment because component might
    // display a table and we can't show divs/spans inside
    // a table, React will complain. Initial state should
    // be so brief (followed by loading) that this is ok.
    return <React.Fragment />;
  };

  return isUpdatedRS(props.rs)
    ? tryRenderUpdated()
    : isErroredRS(props.rs)
    ? renderErrored(props.rs.message)
    : isUpdatingRS(props.rs)
    ? renderUpdating(props.rs.updating_state)
    : isResetRS(props.rs)
    ? renderReset()
    : catchAll();
};
