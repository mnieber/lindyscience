// @flow

import React from "react";
import classnames from "classnames";
import {
  CompositeDecorator,
  // $FlowFixMe
} from "draft-js";

function timePointRegex() {
  return /\<([\w\.]+)\>/g;
}

function timePointStrategy(contentState, contentBlock, callback) {
  findWithRegex(timePointRegex(), contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    // $FlowFixMe
    start = matchArr.index;
    // $FlowFixMe
    callback(start, start + matchArr[0].length);
  }
}

export const createTimePointDecorator = (videoPlayer: any) => {
  const TimePointSpan = props => {
    const r = timePointRegex();
    const matchArr = r.exec(props.decoratedText);
    const t = matchArr && matchArr.length > 1 ? parseFloat(matchArr[1]) : 0;
    const onClick = () => {
      videoPlayer.seekTo(t);
    };

    return (
      <span
        onClick={onClick}
        className={classnames("text-blue", "tp-" + t)}
        data-offset-key={props.offsetKey}
      >
        {props.children}
      </span>
    );
  };

  return new CompositeDecorator([
    {
      strategy: timePointStrategy,
      component: TimePointSpan,
    },
  ]);
};
