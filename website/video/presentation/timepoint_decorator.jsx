// @flow

import React from "react";
import classnames from "classnames";
import { parseVideoTimePoint } from "utils/utils";
import { timePointRegex } from "video/utils";
import {
  CompositeDecorator,
  // $FlowFixMe
} from "draft-js";

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
    // $FlowFixMe
    const tpString = matchArr[1];
    const tp = parseVideoTimePoint(tpString);
    const onClick = () => {
      if (tp != null && tp <= videoPlayer.getDuration()) {
        videoPlayer.seekTo(tp);
      }
    };

    return (
      <span
        onClick={onClick}
        className={classnames("text-blue", "tp-" + (tp || ""))}
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
