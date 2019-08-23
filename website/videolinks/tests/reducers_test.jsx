// @flow

import { test } from "tape";
import * as data from "screens/tests/data"; // TODO

import * as reducers from "videolinks/reducers";
import * as actions from "videolinks/actions";

test("add video links", function(t) {
  let sVideoLinks = reducers.videoLinksReducer(undefined, {});
  t.deepEqual(sVideoLinks, {});

  sVideoLinks = reducers.videoLinksReducer(
    sVideoLinks,
    actions.actAddVideoLinks(data.videoLinks)
  );
  t.deepEqual(sVideoLinks, data.videoLinks);

  t.end();
});
