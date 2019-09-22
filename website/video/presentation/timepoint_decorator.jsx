// @flow

import React from "react";
import {
  CompositeDecorator,
  // $FlowFixMe
} from "draft-js";

const TIMEPOINT_REGEX = /\<([\w\.]+)\>/g;

function timePointStrategy(contentState, contentBlock, callback) {
  findWithRegex(TIMEPOINT_REGEX, contentBlock, callback);
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
    // TODO: not catching <12>
    const matchArr = TIMEPOINT_REGEX.exec(props.decoratedText);
    const t = matchArr && matchArr.length > 1 ? parseFloat(matchArr[1]) : 0;
    const onClick = () => {
      videoPlayer.seekTo(t);
    };

    return (
      <span
        onClick={onClick}
        className="bg-yellow"
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
