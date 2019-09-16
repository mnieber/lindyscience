// @flow

import * as React from "react";
import YouTube from "react-youtube";

// $FlowFixMe
import uuidv4 from "uuid/v4";

type CutVideoPanelPropsT = {};

// $FlowFixMe
class Example extends React.Component {
  render() {
    const opts = {
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    return (
      <YouTube videoId="cxHLVdhkJ6k" opts={opts} onReady={this._onReady} />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }
}

export function CutVideoPanel(props: CutVideoPanelPropsT) {
  const linkPanel = <input />;

  return (
    <div className={"cutVideoPanel panel"}>
      {linkPanel}
      <Example />
    </div>
  );
}
