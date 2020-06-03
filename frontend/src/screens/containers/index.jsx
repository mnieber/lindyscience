// @flow

import { apiUpdateProfile } from 'src/profiles/api';

export function browseToMoveUrl(
  setUrl: Function,
  moveUrlParts: Array<string>,
  mustUpdateProfile: boolean = true
) {
  const moveUrl = moveUrlParts.filter((x) => !!x).join('/');
  if (mustUpdateProfile) {
    apiUpdateProfile(moveUrl);
  }
  const fullUrl = `/app/lists/${moveUrl}`;
  if (window.location.pathname != fullUrl) {
    setUrl(fullUrl);
  }
}
