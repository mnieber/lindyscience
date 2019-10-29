// @flow

import React from "react";
import classnames from "classnames";
import {
  CompositeDecorator,
  // $FlowFixMe
} from "draft-js";

import {
  parseVideoTimePoint,
  timePointRegex,
  timePointToClassName,
} from "video/utils";

function timePointStrategy(contentState, contentBlock, callback) {
  findWithRegex(timePointRegex(), contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = (matchArr: any).index;
    callback(start, start + (matchArr: any)[0].length);
  }
}

export const createTimePointDecorator = (videoPlayer: any) => {
  const TimePointSpan = props => {
    const r = timePointRegex();
    const matchArr = r.exec(props.decoratedText);
    const tpString = (matchArr: any)[1];
    const tp = parseVideoTimePoint(tpString);
    const onClick = () => {
      if (tp != null && tp <= videoPlayer.getDuration()) {
        videoPlayer.seekTo(tp);
      }
    };

    return (
      <span
        onClick={onClick}
        className={classnames("text-blue", timePointToClassName(tp))}
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
