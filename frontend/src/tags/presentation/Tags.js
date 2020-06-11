// @flow

import * as React from 'react';

import type { TagT } from 'src/tags/types';

export function Tags({ tags }: { tags: Array<TagT> }) {
  const items = tags.map((tagName, idx) => {
    return (
      <div key={idx} className="move__tag">
        {tagName}
      </div>
    );
  });

  return <div className={'move__tags'}>{items}</div>;
}
