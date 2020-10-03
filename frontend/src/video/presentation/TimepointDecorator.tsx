import React from 'react';
import classnames from 'classnames';
import { CompositeDecorator } from 'draft-js';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import {
  parseVideoTimePoint,
  timePointRegex,
  timePointToClassName,
} from 'src/video/utils';

function timePointStrategy(contentBlock, callback, contentState) {
  findWithRegex(timePointRegex(), contentBlock, callback);
}

function findWithRegex(regex, contentBlock: any, callback: Function) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = (matchArr as any).index;
    callback(start, start + (matchArr as any)[0].length);
  }
}

export const createTimePointDecorator = (videoController: VideoController) => {
  const TimePointSpan = (props) => {
    const r = timePointRegex();
    const matchArr = r.exec(props.decoratedText);
    const tpString = (matchArr as any)[1];
    const tp = parseVideoTimePoint(tpString);
    const onClick = () => {
      if (tp != null && tp <= videoController.player.getDuration()) {
        videoController.player.seekTo(tp);
      }
    };

    return (
      <span
        onClick={onClick}
        className={classnames('text-blue', timePointToClassName(tp))}
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
