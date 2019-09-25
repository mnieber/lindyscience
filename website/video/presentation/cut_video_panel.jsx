// @flow

import * as React from "react";
import YouTube from "react-youtube";

// $FlowFixMe
import uuidv4 from "uuid/v4";

type CutVideoPanelPropsT = {
  cutVideoLink: string,
  actSetCutVideoLink: Function,
};

export function CutVideoPanel(props: CutVideoPanelPropsT) {
  const onKeyDown = e => {
    if (e.keyCode == 13) {
      props.actSetCutVideoLink(e.target.value);
    }
  };
  const linkPanel = <input onKeyDown={onKeyDown} />;

  return <div className={"cutVideoPanel panel"}>{linkPanel}</div>;
}
