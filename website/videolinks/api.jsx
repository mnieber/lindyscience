import { doQuery } from "app/client";

import type { VideoLinkT } from "videolinks/types";

export function saveVideoLink(moveId: UUID, values: VideoLinkT) {
  if (!values.url.startsWith("http://") && !values.url.startsWith("https://")) {
    values = { ...values, url: "http://" + values.url };
  }
  return doQuery(
    `mutation saveVideoLink(
      $id: String!,
      $moveId: String!
      $url: String!,
      $title: String!,
    ) {
      saveVideoLink(
        pk: $id,
        moveId: $moveId,
        url: $url,
        title: $title,
      ) { ok }
    }`,
    {
      ...values,
      moveId,
    }
  );
}

export function deleteVideoLink(id: UUID) {
  return doQuery(
    `mutation deleteVideoLink(
      $id: String!,
    ) {
      deleteVideoLink(
        pk: $id,
      ) { ok }
    }`,
    {
      id,
    }
  );
}
